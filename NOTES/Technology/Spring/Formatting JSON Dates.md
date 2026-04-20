---
id: 66
title: "Formatting JSON Dates"
summary: "Spring Boot에서 JSON 날짜 포맷을 필드 단위와 전역 설정 단위로 어떻게 제어할지 정리한 노트."
tags:
  - technology
  - spring
  - java
  - jackson
  - json
  - datetime
created: 2026-04-20
updated: 2026-04-20
---
# Formatting JSON Dates

Spring Boot에서 날짜 포맷 문제는 보통 Jackson 직렬화 설정에서 생긴다.  
핵심은 **필드별 포맷을 고정할지, 애플리케이션 전역 포맷을 둘지**, 그리고 `Date` 대신 `LocalDateTime` 같은 Java 8 time 타입을 어떻게 다룰지다.

## 한눈에 보기

| 항목 | 설명 |
| --- | --- |
| 필드 단위 제어 | `@JsonFormat` |
| 전역 기본 포맷 | `spring.jackson.*` 또는 `ObjectMapper` 커스터마이징 |
| 권장 시간 타입 | `LocalDate`, `LocalDateTime` 등 Java Time API |
| 주의점 | `spring.jackson.date-format`은 Java Time 타입에 바로 안 먹는 경우가 있음 |

## 1. 왜 자주 꼬이나

날짜는 아래 요소가 섞이면 금방 복잡해진다.

- 직렬화 대상 타입이 `Date`인지 `LocalDateTime`인지
- 필드마다 포맷이 다른지
- timezone을 어디서 맞출지
- 응답 전역 규칙이 필요한지

그래서 먼저 "필드별 예외"와 "전역 기본값"을 나눠서 보는 게 좋다.

## 2. 필드 단위 포맷: `@JsonFormat`

특정 필드에만 포맷을 강하게 지정하고 싶으면 `@JsonFormat`이 가장 직접적이다.

```java
public class Contact {

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate birthday;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime lastUpdate;
}
```

이 방식은 다음 상황에 적합하다.

- 특정 API 필드만 예외 포맷이 필요할 때
- 화면 계약이 분명하고 DTO가 작을 때

반대로 전역 포맷 정책까지 필드마다 흩뿌리면 유지보수가 어려워진다.

## 3. 전역 포맷 설정

기본 날짜 포맷을 한 번에 맞추고 싶으면 `application.properties`나 `application.yml`에서 Jackson 설정을 줄 수 있다.

```properties
spring.jackson.date-format=yyyy-MM-dd HH:mm:ss
spring.jackson.time-zone=Asia/Seoul
```

다만 참고 자료 기준으로 이 설정은 `java.util.Date`나 `Calendar`에는 편하게 적용되지만,  
`LocalDate`, `LocalDateTime` 같은 Java 8 time 타입에는 기대대로 동작하지 않을 수 있다.

그 경우에는 `ObjectMapper` 커스터마이징이 더 확실하다.

## 4. Java Time API를 기본으로 보는 이유

`Date`보다 `LocalDate`, `LocalDateTime`, `ZonedDateTime` 쪽이 더 명확하고 안전하게 다루기 쉽다.

특히:

- 날짜만 필요하면 `LocalDate`
- 시간까지 필요하지만 timezone은 별도 컨텍스트에서 다루면 `LocalDateTime`
- timezone 자체가 값의 일부면 `ZonedDateTime` 또는 `OffsetDateTime`

처럼 역할이 나뉜다.

실무적으로는 "무조건 `Date`를 계속 쓰기"보다 **도메인 의미에 맞는 java.time 타입을 선택한 뒤 직렬화 정책을 맞추는 편**이 좋다.

## 5. 실무 체크포인트

- DTO마다 포맷이 다르면 `@JsonFormat`
- 서비스 전체 공통 규칙이면 `ObjectMapper` 또는 Jackson 전역 설정
- timezone은 숨은 기본값으로 두지 말고 의도적으로 정한다
- `Date`와 `LocalDateTime`이 섞여 있으면 응답 포맷이 일관적인지 점검한다

## 6. 정리

JSON 날짜 포맷 문제는 단순 문법보다 **타입 선택과 설정 위치**의 문제에 가깝다.

정리하면:

1. Java Time API를 우선 선택하고
2. 예외 필드는 `@JsonFormat`
3. 공통 규칙은 전역 설정
4. timezone까지 포함한 응답 계약을 명확히 한다

이 흐름으로 가는 편이 가장 덜 꼬인다.

## References

- https://www.baeldung.com/spring-boot-formatting-json-dates
- https://velog.io/@yevini118/SpringBoot-Date-%EB%8C%80%EC%8B%A0-LocalDateTime-%EC%9D%84-%EC%82%AC%EC%9A%A9%ED%95%98%EC%9E%90
