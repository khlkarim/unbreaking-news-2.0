import sys
import os
import json
from groq import Groq
from dotenv import load_dotenv
from exiftool import ExifToolHelper
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

load_dotenv()

exif_path = r"C:\Users\karim\dev\workspaces\personal\unbreaking-news-2.0\backend\python\tools\exiftool.exe"

ignore_fields = ""
date_range = ""

if (len(sys.argv) <= 2):
    print("No arguments provided.")
    sys.exit()

path = sys.argv[1]
options = json.loads(sys.argv[2])

if "ignoreFields" in options:
    ignore_fields = "\nIgnore the following metadata fields when analyzing the authenticity: " + options["ignoreFields"]
    
if "dateRange" in options:
    date_range = "\nConsider the file authentic if the creation/modification dates fall within this range: " + options["dateRange"]

with ExifToolHelper(executable=exif_path) as et:
    metadata = et.get_metadata(path)

prompt = "Context : We are trying to determine if a file has been tampered with / displays any signs of suspicious behavior using metadata analysis.\n Here is the file's metadata :" + str(metadata) + "\n\nIn a correct JSON firmat (give ONLY a json object) (raw text, not a code block), give me a authenticity score (out of 100%, indexed by \"score\") with 100% being completely authentic and 0% being absolutely forged, as well as short, brief, notes (an array indexed by \"notes\") where you detail why you came up with that answer. Don't forget to consider these constraints when scoring : "
prompt += "\n" + ignore_fields
prompt += "\n" + date_range

client = Groq()
completion = client.chat.completions.create(
    model="openai/gpt-oss-120b",
    messages=[
        {
            "role": "user",
            "content": prompt
        }
    ],
    temperature=1,
    max_completion_tokens=8192,
    top_p=1,
    reasoning_effort="medium",
    stream=False,
    stop=None
)

response_text = completion.choices[0].message.content

if response_text and "`" in response_text:    
    if "json" in response_text: 
        response_text = response_text[7: -3]
    else:
        response_text = response_text[3: -3]

print(response_text)