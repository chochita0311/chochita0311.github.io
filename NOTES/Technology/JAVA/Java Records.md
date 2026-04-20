---
id: 51
title: "Java Records"
summary: "Java record가 줄여주는 보일러플레이트와 record를 데이터 캐리어에 우선 적용하는 이유를 정리한 노트."
tags:
  - technology
  - java
created: 2026-04-20
updated: 2026-04-20
---
# Java Records

record는 데이터 캐리어를 위한 문법이다. 필드, 생성자, 접근자, `equals/hashCode`, `toString`을 언어 차원에서 짧게 제공하기 때문에 DTO나 읽기 전용 응답 모델을 표현할 때 특히 잘 맞는다.

## 기본 예제

```java
public record UserSummary(Long id, String name, String email) {
}
```

위 선언만으로 필드 저장, canonical constructor, 접근자, `equals/hashCode`, `toString`이 생성된다. 그래서 "데이터를 담는 타입"을 표현할 때 클래스보다 의도가 더 직접적으로 드러난다.

## 어디에 잘 맞나
- API 응답 DTO
- 조회 전용 projection
- 설정 값 객체
- 테스트 비교 대상

즉 행위보다 데이터 구조가 중심인 타입에 적합하다.

## record가 좋은 이유
Baeldung가 설명하듯 record는 단순히 짧게 쓰는 기능이 아니라, "이 타입은 데이터 중심"이라는 설계를 언어 수준에서 표현한다. 그래서 생성자, 동등성, 문자열 표현 기준이 표준화되고, 실수 여지도 줄어든다.

## 어디에 안 맞나
가변 상태가 많거나, 복잡한 도메인 규칙과 행위를 담는 타입에는 잘 맞지 않는 경우가 많다. record는 클래스 문법의 단순 축약이 아니라, 명확히 "데이터 캐리어" 쪽으로 기운 도구다.

예를 들어 상태 전이와 불변식이 중요한 aggregate root를 record로 만드는 것은 대개 어색하다.

## 커스텀 생성자와 검증도 가능하다

```java
public record Money(int amount) {
    public Money {
        if (amount < 0) {
            throw new IllegalArgumentException("amount must be positive");
        }
    }
}
```

즉 record가 단순 데이터 담기만 가능한 것은 아니다. 다만 핵심 축은 여전히 "데이터 캐리어"여야 한다.

## 실무 기준
- 응답 DTO, 조회 모델: record 우선 검토
- 상태 변경과 도메인 행위가 많은 모델: class 유지
- 프레임워크 제약이 강한 타입은 호환성 먼저 확인

## 정리
record는 자바에서 단순 데이터 타입을 표현하는 아주 좋은 기본값이다. 다만 "짧게 쓰기 위한 문법"이 아니라 "데이터 캐리어를 명확히 표현하는 문법"으로 보는 편이 맞다.

## References
- [Baeldung: Java Record Keyword](https://www.baeldung.com/java-record-keyword)
- [A Comprehensive Guide to Java Records](https://medium.com/@mak0024/a-comprehensive-guide-to-java-records-2e8edcbd9c75)
