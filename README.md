# YouTube Script Writer Agent

An intelligent AI agent that generates comprehensive YouTube scripts of any length by breaking large scripts into manageable sections.

## 🎯 Features

- **Smart Chunking**: Handles large scripts (up to 10k, 20k+ words) by breaking them into logical sections
- **Outline Generation**: Creates a structured outline before writing the full script
- **Section-by-Section Writing**: Generates each section individually with context awareness
- **Flow Optimization**: Ensures smooth transitions between sections
- **Flexible Word Limits**: Supports any target word count from 1k to 20k+ words

## 🚀 Quick Start

### 1. Setup Environment

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env with your LongCat API key
```

### 2. Basic Usage

```javascript
import { YouTubeScriptWriter } from './index.js';

const scriptWriter = new YouTubeScriptWriter();

// Generate a script
const script = await scriptWriter.generateScript(
    "10 Life-Changing Productivity Hacks That Actually Work",
    3000  // target word count
);

console.log('Generated script:', script.fullScript);
```

### 3. Run Test Examples

```bash
# Run the test examples
npm test
```

## 📖 How It Works

The agent uses a **3-step chunking strategy** to handle large scripts:

### Step 1: Outline Generation
- Analyzes the title and target word count
- Creates 4-8 logical sections with estimated word counts
- Follows YouTube best practices (hook, main content, conclusion)

### Step 2: Section-by-Section Writing  
- Writes each section individually with full context
- Maintains consistency across sections
- Ensures natural flow and transitions

### Step 3: Final Polish
- Reviews the complete script for flow
- Makes minor improvements and fixes
- Ensures engaging YouTube tone throughout

## 🎬 Script Structure

Generated scripts follow proven YouTube structure:

- **Hook & Introduction** (10-15%): Grab attention immediately
- **Main Content Sections** (60-75%): Core information broken into digestible parts
- **Conclusion & CTA** (10-15%): Wrap up with clear call-to-action

## 🔧 Advanced Usage

### Custom Word Distribution

```javascript
const script = await scriptWriter.generateScript(
    "The Complete Guide to Machine Learning",
    8000  // 8k words - will create 6-8 sections automatically
);
```

### Accessing Section Details

```javascript
const result = await scriptWriter.generateScript(title, wordLimit);

console.log('Outline:', result.outline);
console.log('Sections:', result.sections);
console.log('Total words:', result.actualWords);
console.log('Full script:', result.fullScript);
```

## 📊 Word Limit Guidelines

- **1,000-2,000 words**: 4-5 sections (short videos)  
- **3,000-5,000 words**: 5-6 sections (medium videos)
- **5,000-10,000 words**: 6-7 sections (long-form content)
- **10,000+ words**: 7-8 sections (comprehensive guides)

## 🛠️ Configuration

### Environment Variables

```env
LLM_API_KEY=your-longcat-api-key
LLM_MODEL_NAME=LongCat-Flash-Chat
```

### Model Configuration

The agent uses LongCat API which supports longer context windows, making it ideal for maintaining consistency across large scripts.

## 📝 Example Output

```
🎬 Starting script generation for: "10 Productivity Hacks"
📝 Target word count: 2000
📋 Generated outline with 5 sections
✍️  Writing section 1/5: Hook & Introduction
✅ Completed section "Hook & Introduction" (280 words)
✍️  Writing section 2/5: Time Management Hacks
✅ Completed section "Time Management Hacks" (420 words)
...
🎉 Script generation complete!
📊 Total words: 1,987 (Target: 2000)
```

## 🔍 Tips for Best Results

1. **Use Descriptive Titles**: More specific titles lead to better outlines
2. **Realistic Word Counts**: Allow ±10% variance from target
3. **Check API Limits**: Monitor rate limits for large scripts
4. **Review Output**: Always review generated content for accuracy

## 🚦 Error Handling

The agent includes robust error handling:
- JSON parsing fallbacks for outlines
- Retry mechanisms for API calls  
- Graceful degradation with fallback outlines
- Progress logging for debugging

## 📈 Performance

- **Small scripts** (1-2k words): ~30-60 seconds
- **Medium scripts** (3-5k words): ~60-120 seconds  
- **Large scripts** (5k+ words): ~2-5 minutes

Processing time scales with word count and number of sections.