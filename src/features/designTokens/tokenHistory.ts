import { TokenSet } from './types';

interface TokenVersion {
  id: string;
  timestamp: number;
  tokens: TokenSet;
  description: string;
  fileId: string;
}

interface TokenChange {
  type: 'added' | 'modified' | 'removed';
  path: string[];
  oldValue?: any;
  newValue?: any;
}

export class TokenHistoryManager {
  private static readonly MAX_VERSIONS = 10;
  private static readonly STORAGE_KEY = 'token-history';

  public static saveVersion(tokens: TokenSet, fileId: string, description: string = ''): void {
    const history = this.getHistory();
    const version: TokenVersion = {
      id: this.generateVersionId(),
      timestamp: Date.now(),
      tokens,
      description,
      fileId
    };

    // Add new version at the beginning
    history.unshift(version);

    // Keep only the last MAX_VERSIONS versions
    if (history.length > this.MAX_VERSIONS) {
      history.pop();
    }

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(history));
  }

  public static getHistory(): TokenVersion[] {
    try {
      const history = localStorage.getItem(this.STORAGE_KEY);
      return history ? JSON.parse(history) : [];
    } catch {
      return [];
    }
  }

  public static getVersion(versionId: string): TokenVersion | null {
    const history = this.getHistory();
    return history.find(v => v.id === versionId) || null;
  }

  public static compareVersions(versionId1: string, versionId2: string): TokenChange[] {
    const version1 = this.getVersion(versionId1);
    const version2 = this.getVersion(versionId2);

    if (!version1 || !version2) {
      throw new Error('Version not found');
    }

    return this.diffTokens(version1.tokens, version2.tokens);
  }

  private static diffTokens(oldTokens: TokenSet, newTokens: TokenSet): TokenChange[] {
    const changes: TokenChange[] = [];

    // Helper function to compare nested objects
    const compareObjects = (oldObj: any, newObj: any, path: string[] = []) => {
      const allKeys = new Set([...Object.keys(oldObj), ...Object.keys(newObj)]);

      allKeys.forEach(key => {
        const oldValue = oldObj[key];
        const newValue = newObj[key];
        const currentPath = [...path, key];

        if (!(key in oldObj)) {
          changes.push({
            type: 'added',
            path: currentPath,
            newValue
          });
        } else if (!(key in newObj)) {
          changes.push({
            type: 'removed',
            path: currentPath,
            oldValue
          });
        } else if (typeof oldValue === 'object' && typeof newValue === 'object') {
          compareObjects(oldValue, newValue, currentPath);
        } else if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
          changes.push({
            type: 'modified',
            path: currentPath,
            oldValue,
            newValue
          });
        }
      });
    };

    compareObjects(oldTokens, newTokens);
    return changes;
  }

  private static generateVersionId(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }

  public static getLatestVersion(): TokenVersion | null {
    const history = this.getHistory();
    return history.length > 0 ? history[0] : null;
  }

  public static revertToVersion(versionId: string): TokenSet | null {
    const version = this.getVersion(versionId);
    if (!version) return null;

    // Save current state as a new version before reverting
    const currentTokens = JSON.parse(localStorage.getItem('extractedTokens') || 'null');
    if (currentTokens) {
      this.saveVersion(
        currentTokens,
        version.fileId,
        `Auto-saved before reverting to version ${versionId}`
      );
    }

    // Update current tokens
    localStorage.setItem('extractedTokens', JSON.stringify(version.tokens));
    return version.tokens;
  }
} 