export const formatCurrency = (value: string): string => {
  // 숫자가 아닌 문자 제거
  const numbers = value.replace(/[^\d]/g, "");

  // 숫자가 없으면 빈 문자열 반환
  if (!numbers) return "";

  // 천 단위 구분자 추가
  const formatted = numbers.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return formatted;
};
