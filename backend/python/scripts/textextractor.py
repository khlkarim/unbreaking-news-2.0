import sys
import mimetypes
import base64
from groq import Groq
from dotenv import load_dotenv
import json
import io
import re

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")
load_dotenv()

plagiarism_check = ""
font_tolerance = ""
regex_checks = ""

if len(sys.argv) <= 2:
    print("No arguments provided.")
    sys.exit()

path = sys.argv[1]

# Safe parsing of CLI JSON
try:
    options = json.loads(sys.argv[2])
except json.JSONDecodeError as e:
    print("Invalid JSON provided in arguments:", e)
    sys.exit(1)

mime_type, _ = mimetypes.guess_type(path)

with open(path, "rb") as f:
    image_bytes = f.read()

image_b64 = base64.b64encode(image_bytes).decode("utf-8")
image = f"data:{mime_type};base64,{image_b64}"

if "fontTolerance" in options:
    font_tolerance = (
        "\nGive a font accuracy score (out of 100), consider a font tolerance of: "
        + options["fontTolerance"]
        + " out of 1 (indexed by \"fontScore\")."
    )

prompt = (
    "Transcribe this image exactly as it shows, please. Do not alter anything, "
    "just print it as is. The result should be in correct JSON firmat (give ONLY a json object)  (raw text, not a code block): "
    "{\"content\": ..., \"success\": 1 or 0}."
    + font_tolerance
)

client = Groq()
completion = client.chat.completions.create(
    model="meta-llama/llama-4-scout-17b-16e-instruct",
    messages=[
        {
            "role": "user",
            "content": [
                {"type": "text", "text": prompt},
                {"type": "image_url", "image_url": {"url": image}},
            ],
        }
    ],
    temperature=1,
    max_completion_tokens=1024,
    stream=False,
)

response_text = completion.choices[0].message.content or ""

with open("python/files/output.txt", "w") as f:
    f.write(response_text)

# ---------- JSON Extraction (Safe) ----------
def extract_json(text: str):
    """Extract the first valid JSON object from a string."""
    match = re.search(r"\{(?:[^{}]|(?R))*\}", text)
    if not match:
        raise ValueError("No JSON object found in model output.")
    return match.group(0)


try:
    clean_json = extract_json(response_text)
    response_json = json.loads(clean_json)
except Exception as e:
    print("Failed to parse JSON from model response:", e)
    print("\nRaw model output was:\n", response_text)
    sys.exit(1)

# -------------------------------------------------

# Additional context parameters
if "plagiarismCheck" in options:
    plagiarism_check = (
        "\nIt's " + options["plagiarismCheck"] +
        " that you must check for plagiarism in the content."
    )

if "regexChecks" in options:
    regex_checks = (
        "\nAlso, apply these regex checks on the content: " + options["regexChecks"]
    )

if "fontTolerance" in options:
    font_tolerance = (
        "\nAlso, know that the vision model gave a font accuracy score of "
        + str(response_json.get("fontScore"))
        + " out of 100."
    )

if response_json.get("success") != 1:
    print("Transcription was not successful.")
    sys.exit()

prompt2 = (
    "Context: We are trying to determine if the following text is historically accurate. "
    "Check reliable, trustworthy sources to assign it an accuracy score out of 100%. "
    "Return strict JSON: {\"score\": ..., \"notes\": [...] }."
    + regex_checks
    + plagiarism_check
    + "\nHere is the content: "
    + response_json.get("content", "")
)

completion = client.chat.completions.create(
    model="openai/gpt-oss-120b",
    messages=[{"role": "user", "content": prompt2}],
    temperature=1,
    max_completion_tokens=8192,
    top_p=1,
    reasoning_effort="medium",
    stream=False,
)

response_text2 = completion.choices[0].message.content or ""

# Extract JSON safely from second response
try:
    clean_json2 = extract_json(response_text2)
except Exception as e:
    print("Failed to extract JSON from second response:", e)
    print("\nRaw model output was:\n", response_text2)
    sys.exit(1)

print(clean_json2)
