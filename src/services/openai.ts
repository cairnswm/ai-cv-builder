import OpenAI from 'openai';

class OpenAIService {
  private openai: OpenAI | null = null;
  private cvTemplate: string;
  private coverLetterTemplate: string;

  constructor() {
    this.cvTemplate = `
<h1>Contact Information</h1>
{contact_info}

<h1>Professional Summary</h1>
{summary}

<h1>Core Competencies</h1>
{skills}

<h1>Work Experience</h1>
{experience}

<h1>Education</h1>
{education}

<h1>Additional Information</h1>
{additional}
    `;

    this.coverLetterTemplate = `
<h1>Cover Letter</h1>

Dear Hiring Manager,

{opening_paragraph}

{body_paragraphs}

{closing_paragraph}

Best regards,
[Your name]
    `;
  }

  private initModel(apiKey: string) {
    if (!this.openai) {
      this.openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
    }
  }

  private async makeRequest(apiKey: string, messages: { role: 'system' | 'user'; content: string }[]) {
    this.initModel(apiKey);
    
    try {
      const response = await this.openai!.chat.completions.create({
        model: 'gpt-4',
        messages,
        temperature: 0.7,
      });
      return response.choices[0].message.content;
    } catch (error) {
      throw new Error('Failed to generate content');
    }
  }

  async generateCV(apiKey: string, cv: string, jobSpec: string): Promise<string> {
    const formattedTemplate = this.cvTemplate
      .replace('{contact_info}', '[Extract and format contact details]')
      .replace('{summary}', '[Create targeted summary as paragraphs]')
      .replace('{skills}', '[List relevant skills as bullet points]')
      .replace('{experience}', '[Format relevant experience with dates and details]')
      .replace('{education}', '[Include relevant education with dates]')
      .replace('{additional}', '[Add relevant certifications/projects as bullet points]');

    const messages = [
      { role: 'system', content: 'You are an expert CV optimizer. Extract relevant information from the CV and job specification to create a targeted CV. Format the response in HTML using proper tags and structure.' },
      { role: 'user', content: `Original CV:
${cv}

Job Specification:
${jobSpec}

Create an optimized CV that matches the job requirements using the following format:
${formattedTemplate}` },
    ];

    return this.makeRequest(apiKey, messages);
  }

  async generateCoverLetter(apiKey: string, cv: string, jobSpec: string): Promise<string> {
    const formattedTemplate = this.coverLetterTemplate
      .replace('{opening_paragraph}', '[Format introduction and position as a paragraph]')
      .replace('{body_paragraphs}', '[Format 2-3 paragraphs matching experience to requirements]')
      .replace('{closing_paragraph}', '[Format call to action as a paragraph]');

    const messages = [
      { role: 'system', content: 'You are an expert cover letter writer. Create a focused cover letter that connects the CV with the job requirements. Format the response in HTML using h1 tags for the title, p tags for paragraphs.' },
      { role: 'user', content: `CV:
${cv}

Job Specification:
${jobSpec}

Create a professional cover letter using the following format:
${formattedTemplate}` },
    ];

    return this.makeRequest(apiKey, messages);
  }
}

export const openAIService = new OpenAIService();
