# Introducing Diavoice: Your Voice-Enabled Diabetes AI Companion
**Project Deployed on URL**: https://diabe-ai-buddy-frontend.onrender.com/


Older adults with Type 2 Diabetes face unique challenges: difficulty using apps due to vision or dexterity issues, isolation, and lack of ongoing, tailored support. Most diabetes solutions are reactive and static. DiaVoice introduces a proactive, agentic AI—a voice-first companion that not only responds but initiates meaningful, context-aware interactions to actively support and guide daily diabetes care while fostering emotional well-being.

Meet **DiaVoice** — a new **voice enabled medical assistant** designed specifically for people living with diabetes and face other challenges like old age, vision or dexterity issues. Powered by cutting-edge AI technologies, DiaVoice combines **voice input and output** with a **retrieval-augmented generation (RAG) backend**, creating an intuitive, conversational experience that feels almost like speaking to a human expert and support.
Image of the working screenshot to be added 
![DiaVoice](https://github.com/user-attachments/assets/06b9c9a5-a2c4-4cad-9f20-2a01bde14bc5)



## Why We Created DiaVoice – A Voice-First Companion for Older Adults with Diabetes
we created DiaVoice because we saw a fundamental mismatch between the tools available for diabetes management and the real-world needs of the people who rely on them—especially older adults living with Diabetes. Most solutions today assume a level of tech-savviness, manual input, and visual interaction that many seniors simply find challenging. Vision decline, reduced dexterity, and cognitive fatigue turn seemingly simple apps into daily obstacles. What’s more, these tools tend to be reactive and impersonal, offering generic reminders rather than meaningful, adaptive support.
But diabetes isn’t just about logging numbers—it’s a daily emotional and behavioral journey. Many seniors live alone, lack consistent human support, and face decision fatigue around medication, meals, and how they feel each day.
- We wanted to remove the friction of managing diabetes by introducing an always-there, voice-first AI that speaks their language—literally and hence DiaVoice was born.
- We focused on agentic design, so the AI initiates care—not just waits for input. It checks in, notices patterns, nudges gently, and knows when to involve caregivers.
- We designed DiaVoice to be emotionally intelligent—not just a tracker, but a trusted companion who listens, learns, and evolves with the user.
In short, we built DiaVoice to bring care to the user, rather than forcing the user to chase care through yet another screen. Because at this stage of life, what users need most is support that’s personal, proactive, and human-like. That’s exactly what DiaVoice delivers.

## Key Features

### 1. Voice Interaction
With voice input and output capabilities, DiaVoice Buddy allows users to **talk naturally** to the chatbot — no typing necessary. Whether you're cooking, exercising, or simply prefer speaking, you can:
- **Ask questions aloud**
- **Hear answers read back clearly**
- **Have a multi-turn conversation** to dive deeper into topics (is this available) ??
- **Suggestions** Suggest follow up questions to continue the conversation 

The experience is designed to be hands-free, making it especially helpful for users with limited mobility, vision challenges, or those multitasking.

### 2. Retrieval-Augmented Generation (RAG) Engine
Unlike basic chatbots that rely only on pre-programmed scripts, Diabe-AI Buddy uses a **RAG-based architecture**. Here's how it works:
- It **retrieves** relevant, up-to-date information from a trusted diabetes-focused knowledge base.
- It **generates** coherent and customized answers, integrating retrieved facts into natural, human-like responses.
- It **Suggests** addition questions that they user may be looking answers for as follow up questions

This ensures that DiaVoice is both **grounded in factual knowledge** and **adaptive to unique questions**, even if they are highly specific.

### 3. Trusted Medical Content
The knowledge base used by Diabetes Buddy is curated from credible sources, including:
- American Diabetes Association guidelines
- Peer-reviewed clinical articles
- Nutrition and exercise recommendations for diabetics
- FAQs from certified diabetes educators

While Diabe-AI Buddy is **not a substitute for professional medical advice**, it is carefully designed to **supplement your learning ** and **provide support and companionship**.

### 4. Web App Convenience
Diabetes Buddy is a **simple and accessible web app**:
- No downloads or installations needed
- Mobile-friendly for easy use on smartphones and tablets
- Secure data handling with privacy protections 

You can start using it directly through your web browser from phone/ipad/laptop or any device— whenever and wherever you need support.

## A Glimpse into How It Works 

When you ask a question like:
> "How can I use a Glucometer ?"

Here’s what happens behind the scenes:
1. **Voice Input**: Your spoken question is transcribed.
2. **RAG Search**: The system searches its diabetes-focused database for the most relevant documents.
3. **Answer Generation**: It combines retrieved facts to generate a natural language answer.
4. **Voice Output**: The answer is read back to you in a friendly, easy-to-understand tone.
5. **Text Output** The answer is also show in the text. In addition to the response it suggests follow up questions which you would want to know based on your first question

![image](https://github.com/user-attachments/assets/09a561e6-4ec8-4f9e-aea8-70f59174314a)

> "What should I eat after a low blood sugar episode?"

Here’s what happens behind the scenes:
1. **Voice Input**: Your spoken question is transcribed.
2. **RAG Search**: The system searches its diabetes-focused database for the most relevant documents.
3. **Answer Generation**: It combines retrieved facts to generate a natural language answer.
4. **Voice Output**: The answer is read back to you in a friendly, easy-to-understand tone.
5. **Text Output** The answer is also show in the text. In addition to the response it suggests follow up questions which you would want to know based on your first question

This pipeline delivers **quick, accurate, and conversational** support — giving you more confidence in your daily diabetes management.

## Technical Details 
## Architecture 
![image](https://github.com/user-attachments/assets/5b16b032-8520-4752-a86b-61a80cbd200f)

## Data Sources Used:

1. Glucose:
    "https://www.diabetes.org/healthy-living/medication-treatments/blood-glucose-testing-and-control",
    "https://www.niddk.nih.gov/health-information/diabetes/overview/managing-diabetes/know-blood-sugar-numbers"
   
3. Medication: 
    "https://www.diabetes.org/healthy-living/medication-treatments",
    "https://www.niddk.nih.gov/health-information/diabetes/overview/insulin-medicines-treatments"
   
4. Meal:
    "https://diabetesjournals.org/care/article/40/Supplement_1/S33/36913/4-Lifestyle-Management",
    "https://www.niddk.nih.gov/health-information/diabetes/overview/diet-eating-physical-activity",
    "./backend/data/nutritiondata.csv",
    "./backend/data/pre_food.csv"
   
5. Wellness: 
    "https://www.diabetes.org/healthy-living/mental-health",
    "https://www.niddk.nih.gov/health-information/diabetes/overview/preventing-problems"
   
6. General: 
    "https://www.cdc.gov/diabetes/about/about-type-2-diabetes.html?CDC_AAref_Val=https://www.cdc.gov/diabetes/basics/type2.html",
    "https://www.niddk.nih.gov/health-information/diabetes/overview",
    "./backend/data/medquad.csv"
   
## Technologies Used:
1. Front End: React + Type Script
2. AI Stacks
- Large Language Model: Gemini Flash 2.0 
- Embedding Model: Gemini Embedding (for RAG)
- Voice Handling: Gemini Flash 2.0 (ASR), OpenTTS (TTS)  
3. Data Storage and Retrieval: Search Grounding (URLs), Local CSV files, Vector store for memory 
4. Data Processing and Agent Flow Orchestration: Lang Graph
5. Backend and Application Server: Multiple integration points for data ingestion and retrieval, speech-to-text (ASR) AI engine, chat completion API (Gemini) and text-to-speech (TTS) AI engine.
  
## Target Audience:
**Primary Target Audience** 
* Older Adults with Type 2 Diabetes – Seniors aged 60+ who often live alone, face challenges with screens, and need simple, voice-based, empathetic health support.

**Secondary Target Audience**
* Caregivers of Older Adults – Family members or aides seeking peace of mind through smart, minimal, and meaningful health alerts.
* Geriatric Healthcare Providers – Clinicians who want low-effort tools that help patients adhere to care plans and reduce risks.

**Tertiary Target Audience**
* Senior Living Communities & Facilities – Organizations looking for scalable voice-first companions to support resident wellness.
* Healthcare Payers & Insurers – Plans aiming to lower avoidable hospital visits and improve chronic care outcomes for older adults.
* Public Health & Aging Advocacy Organizations – Groups promoting access to inclusive digital health tools for underserved senior populations.## Future Roadmap

DiaVoice is just getting started! Planned features include:
- **Personalized tracking** (e.g., blood glucose logs, food diaries)
- **Emergency support** (triage guidance for high-risk symptoms)
- **Reminder and Alert** (reminder to take insulin injection or measure blood sugar level if forgotten)
- **Caregiver support** (Call to caregiver if the user wants)
- **Integration with smartwatches and wearables** for even more seamless voice interaction
- **Multilingual support** to make the platform accessible worldwide

## Project Team
* Harshdeep Gupta (Harshdeep.Gupta@microsoft.com)
* Minha Hwang (minhahwang@microsoft.com) 
* Pallavi Gupta (pallavigupta@microsoft.com)
* Prachi Agrawal (Prachi.Agrawal@microsoft.com)

## Project Repository URL
https://github.com/HarshdeepGupta/diabe-ai-buddy/edit/main/README.md
## Deployed EndPoint URL
 https://lovable.dev/projects/34488ee5-e2c2-4996-9205-7bae2ab68ce7 (To be Updated)
## Project Video
https://youtu.be/4d2ZSyX-nYQ




