/**
 * Generated by orval v7.3.0 🍺
 * Do not edit manually.
 * View Nest API
 * API documentation for View Nest application
 * OpenAPI spec version: 1.0
 */
import type { UserResponseDto } from './userResponseDto';

export interface QuestionAnswerResponseDto {
  /**
   * 내용
   * @nullable
   */
  cn: string | null;
  /** ID */
  id: number;
  /**
   * 수정 일시
   * @nullable
   */
  mdfcnDt?: string | null;
  /**
   * 등록 일시
   * @nullable
   */
  regDt?: string | null;
  /** 제목 */
  ttl: string;
  /**
   * 상위 ID
   * @nullable
   */
  upId: number | null;
  /** 사용자 정보 */
  user: UserResponseDto;
}
