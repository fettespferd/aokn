import { describe, it, expect } from 'vitest';
import { validateAndParsePageData, exportToJson } from './jsonStorage';
import type { PageData } from '../types/page';

describe('jsonStorage', () => {
  it('validates and parses valid PageData', () => {
    const valid: PageData = {
      pageId: 'pregnancy',
      pageTitle: 'Schwangerschaft',
      lifeStages: [],
      sections: {
        helpful: [
          {
            id: 't1',
            section: 'helpful',
            title: 'Test',
            icon: 'FileText',
            buttonEnabled: false,
            isVisible: true,
            sortOrder: 0,
          },
        ],
        offers: [],
        wissenswertes: [],
      },
    };
    const json = JSON.stringify(valid);
    const result = validateAndParsePageData(json);
    expect(result).toEqual(valid);
  });

  it('returns null for invalid JSON', () => {
    expect(validateAndParsePageData('{ invalid }')).toBeNull();
    expect(validateAndParsePageData('')).toBeNull();
  });

  it('exports to formatted JSON', () => {
    const data: PageData = {
      pageId: 'p',
      pageTitle: 'T',
      lifeStages: [],
      sections: { helpful: [], offers: [], wissenswertes: [] },
    };
    const json = exportToJson(data);
    expect(json).toContain('"pageId": "p"');
    expect(json).toContain('"pageTitle": "T"');
  });
});
