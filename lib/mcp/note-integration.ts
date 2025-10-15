// lib/mcp/note-integration.ts
// 메모장 앱용 MCP 통합 기능
// 노트 관련 작업을 위한 MCP 도구들을 활용하는 인터페이스

import { MCPClient } from './client';
import { MCPNoteIntegration } from './types';

export class MCPNoteIntegrationImpl implements MCPNoteIntegration {
  constructor(private client: MCPClient) {}

  // 노트 내용 개선 (AI 도움)
  async enhanceNoteContent(content: string, context?: string): Promise<string> {
    try {
      const result = await this.client.executeTool('note-enhancer', 'enhance_content', {
        content,
        context,
        max_length: 1000,
      });

      if (result.success && result.result?.enhanced_content) {
        return result.result.enhanced_content;
      }

      // 폴백: 원본 내용 반환
      return content;
    } catch (error) {
      console.error('Failed to enhance note content:', error);
      return content;
    }
  }

  // 노트 요약 생성
  async generateNoteSummary(content: string): Promise<string> {
    try {
      const result = await this.client.executeTool('note-summarizer', 'summarize', {
        content,
        max_length: 200,
        style: 'bullet_points',
      });

      if (result.success && result.result?.summary) {
        return result.result.summary;
      }

      // 기본 요약 생성 (간단한 추출)
      const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 10);
      const summary = sentences.slice(0, 3).join('. ').trim();
      return summary || '요약을 생성할 수 없습니다.';
    } catch (error) {
      console.error('Failed to generate note summary:', error);
      return '요약 생성 중 오류가 발생했습니다.';
    }
  }

  // 태그 추천
  async suggestTags(content: string, existingTags: string[] = []): Promise<string[]> {
    try {
      const result = await this.client.executeTool('tag-suggester', 'suggest_tags', {
        content,
        existing_tags: existingTags,
        max_tags: 6,
        language: 'ko',
      });

      if (result.success && result.result?.tags) {
        return result.result.tags;
      }

      // 기본 태그 생성 (키워드 추출)
      const words = content.toLowerCase().split(/\W+/);
      const commonWords = ['회의', '프로젝트', '아이디어', '메모', '중요', '긴급'];
      const suggestedTags = commonWords.filter(word =>
        words.includes(word) && !existingTags.includes(word)
      );

      return suggestedTags.slice(0, 3);
    } catch (error) {
      console.error('Failed to suggest tags:', error);
      return [];
    }
  }

  // 검색 쿼리 개선
  async enhanceSearchQuery(query: string): Promise<string> {
    try {
      const result = await this.client.executeTool('search-enhancer', 'enhance_query', {
        query,
        expand_synonyms: true,
        add_related_terms: true,
      });

      if (result.success && result.result?.enhanced_query) {
        return result.result.enhanced_query;
      }

      return query;
    } catch (error) {
      console.error('Failed to enhance search query:', error);
      return query;
    }
  }

  // 맞춤법 및 문법 검사
  async checkGrammar(content: string): Promise<{
    corrected: string;
    suggestions: Array<{ type: string; message: string; position: number }>;
  }> {
    try {
      const result = await this.client.executeTool('grammar-checker', 'check', {
        text: content,
        language: 'ko',
      });

      if (result.success && result.result) {
        return {
          corrected: result.result.corrected_text || content,
          suggestions: result.result.suggestions || [],
        };
      }

      return {
        corrected: content,
        suggestions: [],
      };
    } catch (error) {
      console.error('Failed to check grammar:', error);
      return {
        corrected: content,
        suggestions: [],
      };
    }
  }

  // 외부 리소스에서 정보 검색
  async searchExternalInfo(query: string): Promise<string[]> {
    try {
      const result = await this.client.executeTool('web-search', 'search', {
        query,
        max_results: 3,
        include_snippets: true,
      });

      if (result.success && result.result?.results) {
        return result.result.results.map((r: any) => r.snippet || r.title || '');
      }

      return [];
    } catch (error) {
      console.error('Failed to search external info:', error);
      return [];
    }
  }

  // 노트 템플릿 추천
  async suggestTemplates(content: string): Promise<Array<{ name: string; description: string; template: string }>> {
    try {
      const result = await this.client.executeTool('template-suggester', 'suggest', {
        content,
        max_suggestions: 3,
      });

      if (result.success && result.result?.templates) {
        return result.result.templates;
      }

      return [];
    } catch (error) {
      console.error('Failed to suggest templates:', error);
      return [];
    }
  }

  // 노트 우선순위 분석
  async analyzePriority(content: string): Promise<{
    priority: 'low' | 'medium' | 'high';
    reasons: string[];
    deadline?: string;
  }> {
    try {
      const result = await this.client.executeTool('priority-analyzer', 'analyze', {
        content,
      });

      if (result.success && result.result) {
        return {
          priority: result.result.priority || 'medium',
          reasons: result.result.reasons || [],
          deadline: result.result.deadline,
        };
      }

      return {
        priority: 'medium',
        reasons: ['우선순위 분석을 수행할 수 없습니다.'],
      };
    } catch (error) {
      console.error('Failed to analyze priority:', error);
      return {
        priority: 'medium',
        reasons: ['우선순위 분석 중 오류가 발생했습니다.'],
      };
    }
  }
}

// MCP 노트 통합 팩토리 함수
export function createMCPNoteIntegration(client: MCPClient): MCPNoteIntegration {
  return new MCPNoteIntegrationImpl(client);
}
