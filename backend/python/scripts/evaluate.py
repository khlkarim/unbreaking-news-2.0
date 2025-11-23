import sys
import io
import mimetypes
import base64
import os
from groq import Groq
from dotenv import load_dotenv

# Ensure stdout can handle Unicode
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

load_dotenv()


def encode_image_to_base64(path: str) -> str:
    """Read an image file and encode it as a base64 data URL."""
    if not os.path.isfile(path):
        raise FileNotFoundError(f"File does not exist: {path}")
    
    mime_type, _ = mimetypes.guess_type(path)
    if not mime_type or not mime_type.startswith("image/"):
        raise ValueError(f"Invalid or unsupported image type: {path}")

    try:
        with open(path, "rb") as f:
            image_bytes = f.read()
        image_b64 = base64.b64encode(image_bytes).decode("utf-8")
        return f"data:{mime_type};base64,{image_b64}"
    except Exception as e:
        raise IOError(f"Error reading file '{path}': {e}")


def call_groq_model(messages, model, **kwargs):
    """Call Groq API and return response text safely."""
    client = Groq()
    try:
        completion = client.chat.completions.create(
            model=model,
            messages=messages,
            **kwargs
        )
        # Safely extract response text
        if not completion.choices or not hasattr(completion.choices[0], "message"):
            raise ValueError("Unexpected response from Groq API")
        return completion.choices[0].message.content
    except Exception as e:
        raise RuntimeError(f"Error calling Groq API: {e}")


def main():
    if len(sys.argv) <= 1:
        print("Usage: python script.py <image_path>")
        sys.exit(1)

    path = sys.argv[1]

    try:
        image_data_url = encode_image_to_base64(path)
    except Exception as e:
        print(f"Failed to encode image: {e}")
        sys.exit(1)

    # Step 1: Transcribe the image
    prompt_transcribe = "Transcribe this image exactly as it shows, please. Do not alter anything, just print it as is."
    try:
        transcribed_text = call_groq_model(
            messages=[{
                "role": "user",
                "content": [
                    {"type": "text", "text": prompt_transcribe},
                    {"type": "image_url", "image_url": {"url": image_data_url}}
                ]
            }],
            model="meta-llama/llama-4-scout-17b-16e-instruct",
            temperature=1,
            max_completion_tokens=1024,
            stream=False
        )
    except Exception as e:
        print(f"Failed to transcribe image: {e}")
        sys.exit(1)

    # Step 2: Evaluate historical accuracy
    prompt_evaluate = (
        "Context: We are trying to determine if the following text is historically accurate. "
        "Check reliable, trustworthy sources to assign it an accuracy score (check for bias, inconsistencies, or misinformation). "
        "In strict JSON format, give me the accuracy score (out of 100%, indexed by 'authenticityScore') with 100% being completely true "
        "and 0% being absolutely wrong, as well as short, brief notes (an array indexed by 'notes') detailing why you came up with that answer. "
        f"Here is the content: {transcribed_text}"
    )

    try:
        evaluation_result = call_groq_model(
            messages=[{"role": "user", "content": prompt_evaluate}],
            model="openai/gpt-oss-120b",
            temperature=1,
            max_completion_tokens=8192,
            top_p=1,
            reasoning_effort="medium",
            stream=False
        )
    except Exception as e:
        print(f"Failed to evaluate text: {e}")
        sys.exit(1)

    # Print safely in UTF-8
    print(evaluation_result)


if __name__ == "__main__":
    main()
