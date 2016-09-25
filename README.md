# NagARam

Rough steps to create the skill for youre own use:

1. Go to AWS developer panel. Select cloud formation service.
2. Create a stack and specify Amazon S3 templare URL as https://s3.amazonaws.com/alexa-skills-kit-samples-cfn/cloudformation.json
3. Name it NagARam
4. Go to developer.amazon.com select Alexa and create a skill.


Use this for the skill schema:
```
{
  "intents": [
    {
      "intent": "GetAnagram",
      "slots": [
      {
        "name" : "word",
        "type": "WORD"
      }
     ]
    },
   {
      "intent": "AMAZON.HelpIntent"
    },
    {
      "intent": "AMAZON.StopIntent"
    },
    {
      "intent": "AMAZON.CancelIntent"
    }
  ]
}
```

Create a custom slot type called WORD and copy all the data from [this list] (https://raw.githubusercontent.com/first20hours/google-10000-english/master/20k.txt) and use it for the value.


Use the following for the utterances:
```
GetAnagram what is an anagram for {word}
GetAnagram what's an anagram for {word}
GetAnagram get an anagram for {word}
GetAnagram find an anagram for {word}
GetAnagram tell me an anagram for {word}
GetAnagram give me an anagram for {word}
GetAnagram anagram for {word}
```
