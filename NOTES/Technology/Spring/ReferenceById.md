---
id: 79
title: "ReferenceById"
summary: "findById와 getById/getReferenceById가 어떤 차이로 쓰이는지 정리한 노트."
tags:
  - technology
  - spring
  - java
  - spring-data-jpa
  - entity
created: 2026-04-20
updated: 2026-04-20
---
# ReferenceById

Spring Data JPA에서 엔티티를 다룰 때는 실제 값을 읽는 것과, 참조만 확보하는 것을 구분해서 봐야 한다. `findById`와 `getReferenceById` 계열은 이 차이 때문에 쓰임이 갈린다.

## 한눈에 보기
- `findById`: 실제 조회, `Optional`
- `getById`: 과거 API, 현재는 `getReferenceById` 관점으로 이해하는 편이 낫다
- `getReferenceById`: 프록시 참조 확보
- 판단 기준: 존재 여부 확인이 필요한가, 참조만 있으면 되는가

## 핵심 차이

| 메서드 | 성격 |
| --- | --- |
| `findById` | `Optional` 반환, 없을 수 있음을 전제로 조회 |
| `getById` | 직접 반환, 없으면 예외 가능 |
| `getReferenceById` | 실제 값보다 reference 확보 목적에 가까움 |

Baeldung 정리 기준으로 `findById`는 안전한 읽기 API에 가깝고, `getReferenceById`는 id만 알고 프록시 참조를 잡고 싶을 때 더 자연스럽다.

## 언제 어떤 쪽이 맞나

- 존재 여부가 불확실: `findById`
- 반드시 존재해야 하고 없으면 예외가 자연스러움: `getReferenceById` 계열

```java
Order order = orderRepository.findById(orderId)
    .orElseThrow();

Member memberRef = memberRepository.getReferenceById(memberId);
order.changeMember(memberRef);
```

위처럼 실제 조회가 필요한 것과 연관관계 참조만 필요한 것을 나누면 repository 메서드 선택이 더 명확해진다.

## 실무 포인트

- 단순 조회 API에서는 `findById`가 더 안전하다
- 연관관계 설정처럼 id reference만 필요할 때는 reference 계열이 더 자연스럽다
- “조회”와 “참조만 확보”를 코드에서 구분하는 습관이 중요하다

## 왜 구분이 중요한가
엔티티를 실제로 읽는 것과 프록시 참조만 확보하는 것은 트랜잭션 경계, lazy loading, 예외 발생 시점이 다르다. 이 차이를 모르면 repository 메서드 선택이 우연에 가까워진다.

특히 프록시를 잡아 두고 트랜잭션 밖에서 필드 접근을 시도하면 lazy loading 문제와 예외가 뒤늦게 드러날 수 있다. 그래서 reference 계열은 "읽지 않을 것"이 어느 정도 확실할 때 더 적합하다.

## 정리

이 노트의 핵심은 메서드 이름 암기가 아니라, 엔티티를 실제로 읽고 싶은지 아니면 참조만 필요로 하는지를 구분하는 것이다. 이 관점이 잡히면 `findById`와 reference 계열의 선택 기준도 자연스럽게 따라온다.

## References

- https://www.baeldung.com/spring-data-findbyid-vs-getbyid
