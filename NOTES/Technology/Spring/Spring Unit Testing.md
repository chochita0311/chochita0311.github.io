---
id: 86
title: "Spring Unit Testing"
summary: "Spring unit testing에서 프레임워크 지원 도구를 어떻게 보고 어디까지 pure unit test로 가져갈지 정리한 노트."
tags:
  - technology
  - spring
  - java
  - test
  - unit-test
created: 2026-04-20
updated: 2026-04-20
---
# Spring Unit Testing

Spring 테스트는 전부 컨테이너를 띄우는 통합 테스트가 아니다. 공식 문서에도 pure unit test를 돕는 지원 클래스와 유틸리티가 별도로 정리돼 있다.

## 한눈에 보기
- 가장 먼저 묻는 질문: 이 테스트가 정말 Spring을 필요로 하는가
- 기본 원칙: 가능한 건 pure unit test로 유지
- Spring support가 필요한 경우: wiring, context integration, framework helper 사용
- 대표 도구: `ReflectionTestUtils`

## 기본 관점

- 가능한 건 pure unit test로 유지
- Spring이 꼭 필요한 지점만 framework support를 쓴다
- 테스트 목적이 wiring 검증인지 로직 검증인지 먼저 구분한다

## 자주 보는 지원 도구

- `ReflectionTestUtils`
  - private field 설정, non-public 메서드 호출 같은 특수한 테스트 상황에서 사용

Spring 공식 문서도 `ReflectionTestUtils`를 이런 제한적 용도로 소개한다. 즉 테스트를 편하게 만드는 도구이지, 설계를 가리는 기본값은 아니다.

## 예제로 보면 기준이 더 분명하다
순수 계산과 의존성 mocking만 있으면 보통 Spring 없이 테스트할 수 있다.

```java
OrderService service = new OrderService(fakeRepository, fakeClock);
OrderResult result = service.create(command);
```

반대로 빈 wiring, 프로퍼티 바인딩, 컨테이너 후처리가 검증 대상이라면 그때 Spring support가 의미를 가진다.

## 실무 포인트

- 리플렉션 기반 테스트는 마지막 수단에 가깝다
- 로직 검증은 프레임워크 없이도 가능한지 먼저 본다
- Spring test support는 편하지만, 테스트가 프레임워크 결합적으로 변하지 않게 조심한다

## 왜 구분이 중요한가
컨테이너를 띄우는 테스트는 강력하지만 느리고, 실패 원인도 wiring인지 로직인지 섞이기 쉽다. 반대로 pure unit test는 빠르고 원인 분리가 명확하다. 그래서 무엇을 검증하는 테스트인지 먼저 정하는 편이 좋다.

## 기억하기 쉬운 기준
서비스 로직의 계산과 분기만 검증하면 unit test다. 애노테이션, 빈 등록, 설정 바인딩, 트랜잭션 프록시가 결과에 영향을 주면 그때 Spring support를 고려하면 된다.

## 정리

Spring Unit Testing의 핵심은 도구 이름보다, 어디까지는 일반 unit test로 두고 어디서부터 Spring 지원을 받을지를 구분하는 것이다. 프레임워크를 덜 띄울수록 테스트는 보통 더 빠르고 더 분명해진다.

## References

- https://docs.spring.io/spring-framework/reference/testing/unit.html#unit-testing-support-classes
