---
id: 48
title: "MultiLine String"
summary: "Java 멀티라인 문자열 처리 방식과 text block을 기본 선택지로 보는 이유를 정리한 노트."
tags:
  - technology
  - java
created: 2026-04-20
updated: 2026-04-20
---
# MultiLine String

멀티라인 문자열은 예전 자바에서 꽤 불편한 영역이었다. 줄바꿈 이스케이프, `+` 연결, `StringBuilder`, `String.join()` 같은 우회가 많았는데, text block 이후에는 이 문제가 거의 정리됐다.

## 기존 방식이 왜 불편했나

```java
String json = "{\n" +
    "  \"name\": \"kim\",\n" +
    "  \"age\": 30\n" +
    "}";
```

이 방식은 작은 문자열에서는 버틸 수 있어도, SQL이나 JSON 예제가 길어질수록 원문 구조를 읽기 어려워진다.

## text block이 좋은 이유
SQL, JSON, HTML처럼 구조가 눈에 보여야 하는 문자열은 원문 형태에 가깝게 유지되는 것이 중요하다.

```java
String json = """
    {
      "name": "kim",
      "age": 30
    }
    """;
```

text block은 이 점에서 기존 방식보다 훨씬 읽기 쉽다.

## 언제 특히 유용한가
- SQL 쿼리
- JSON 예제
- HTML 템플릿 조각
- 테스트 fixture 문자열

## 실무 기준
- 멀티라인 문자열 기본값: text block
- 한 줄짜리 단순 문자열: 일반 문자열 리터럴 유지
- indentation과 trailing newline 의도는 코드 리뷰에서 함께 확인

## 특히 테스트 코드에서 가치가 크다
응답 JSON, SQL fixture, 예상 로그 같은 문자열은 구조가 그대로 보일수록 비교와 리뷰가 쉬워진다. text block은 본문 구조를 유지한 채 테스트 데이터를 둘 수 있어서 테스트 가독성 개선 효과가 꽤 크다.

## 정리
멀티라인 문자열이 필요하면 과거 습관대로 이어 붙이기보다 text block을 먼저 떠올리는 편이 맞다. 가독성과 유지보수성이 훨씬 낫다.

## References
- [Baeldung: Java Multi-line String](https://www.baeldung.com/java-multiline-string)
