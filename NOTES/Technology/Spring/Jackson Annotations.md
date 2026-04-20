---
id: 70
title: "Jackson Annotations"
summary: "Jackson 어노테이션으로 JSON 직렬화/역직렬화 형태를 어떻게 제어하는지 핵심만 정리한 노트."
tags:
  - technology
  - spring
  - java
  - jackson
  - json
created: 2026-04-20
updated: 2026-04-20
---
# Jackson Annotations

Jackson 어노테이션은 Java 객체와 JSON 사이의 매핑을 조절하는 가장 직접적인 수단이다.

## 한눈에 보기
- 대상: DTO 단위 직렬화/역직렬화 규칙
- 강점: 필드별 예외를 빠르게 표현
- 자주 쓰는 것: `@JsonProperty`, `@JsonIgnore`, `@JsonInclude`, `@JsonFormat`, `@JsonCreator`
- 함께 보는 것: 전역 `ObjectMapper` 설정

## 자주 보는 어노테이션

| 어노테이션 | 역할 |
| --- | --- |
| `@JsonProperty` | 필드 이름 지정 |
| `@JsonIgnore` | 직렬화/역직렬화 제외 |
| `@JsonInclude` | null 등 특정 값 제외 |
| `@JsonFormat` | 날짜/시간 포맷 지정 |
| `@JsonCreator` | 생성자 기반 역직렬화 제어 |

## 간단한 예제

```java
public record UserResponse(
    @JsonProperty("user_name") String name,
    @JsonInclude(JsonInclude.Include.NON_NULL) String email
) {
}
```

이런 식으로 DTO 단위에서 외부 JSON 계약을 바로 고정할 수 있다.

## 언제 쓰나

- 외부 API 계약상 필드 이름이 다를 때
- 응답에 불필요한 필드를 숨길 때
- 날짜 포맷을 명시하고 싶을 때
- immutable DTO를 생성자 기반으로 역직렬화할 때

즉 어노테이션은 공통 정책보다는 "이 DTO만 예외가 있다"를 표현할 때 가장 강하다.

## 실무 포인트

- DTO 계약을 로컬에서 빠르게 맞출 때는 어노테이션이 가장 편하다
- 전역 정책까지 전부 어노테이션으로 풀면 관리가 어려워진다
- 날짜 포맷처럼 공통 규칙은 전역 `ObjectMapper` 설정과 역할을 나눠 본다

특히 외부 API와 필드명 규칙이 다를 때 `@JsonProperty`는 매우 직접적이지만, 프로젝트 전체 naming strategy까지 매번 DTO에서 풀어내기 시작하면 오히려 중복이 커진다.

## 왜 전역 설정과 나눠 봐야 하나
필드 단위 예외는 어노테이션이 편하지만, 프로젝트 전체 규칙까지 전부 어노테이션으로 풀기 시작하면 DTO마다 설정이 흩어진다. 그래서 "로컬 예외는 어노테이션, 공통 정책은 `ObjectMapper`"라는 기준이 유지보수에 유리하다.

## 정리

Jackson 어노테이션은 **DTO 수준의 JSON 계약을 빠르게 고정하는 도구**로 이해하면 된다.  
필드 단위 예외는 어노테이션, 공통 규칙은 전역 설정으로 나누는 편이 안정적이다. 즉 편한 도구지만, 전역 정책의 대체물로 보면 안 된다.

## References

- https://www.baeldung.com/jackson-annotations
