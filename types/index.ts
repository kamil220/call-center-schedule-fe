/**
 * Type definitions index file
 * Re-exports types from various type definition files
 */

// Re-export common types
export * from './common/api.type';
export * from './common/collection.type';

// Re-export auth types (API and Store)
export * from './auth/api.types';
export * from './auth/store.types';

// Re-export user types (API and Domain)
export * from './users/api.types'; // Includes ApiUser interface
export * from './users/domain.types';

// Re-export calendar types
export * from './calendar/api.types';

// Re-export mappers
export * from './mappers';

export interface Operator {
  id: number;
  name: string;
}

export interface Line {
  id: number;
  name: string;
  number: string;
} 