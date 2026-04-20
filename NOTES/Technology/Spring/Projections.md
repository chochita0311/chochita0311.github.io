---
id: 76
title: "Projections"
summary: "Spring Data JPA projection으로 필요한 필드만 조회할 때 interface 기반과 DTO 기반을 어떻게 볼지 정리한 노트."
tags:
  - technology
  - spring
  - java
  - spring-data-jpa
  - projection
created: 2026-04-20
updated: 2026-04-20
---
# Projections

Projection은 엔티티 전체를 가져오지 않고 **필요한 필드만 조회 결과로 받는 방식**이다.  
읽기 모델이 단순할수록 유용하지만, projection 종류에 따라 제약이 다르다.

## 한눈에 보기
- 목적: 엔티티 전체 대신 필요한 읽기 모델만 가져오기
- 대표 유형: interface-based, DTO/class-based
- 잘 맞는 상황: 목록 조회, 읽기 전용 API, 연관관계 축소
- 주의점: repository 시그니처 남발, projection을 엔티티처럼 착각하는 문제

## 대표 유형

| 유형 | 설명 |
| --- | --- |
| interface-based | getter 시그니처 기반으로 필요한 필드만 노출 |
| DTO/class-based | 생성자 기반으로 DTO를 직접 반환 |

## interface-based projection

Spring Data 공식 문서에서 가장 기본적인 형태는 인터페이스 projection이다.

```java
interface NamesOnly {
    String getFirstname();
    String getLastname();
}
```

프로퍼티 이름이 aggregate root 필드와 정확히 맞아야 자연스럽게 동작한다.

## DTO projection

DTO projection은 응답 구조를 명확하게 고정하기 좋다.  
대신 JPQL constructor expression이나 매핑 규칙을 더 신경 써야 한다.

즉 interface projection은 가볍고 빠르게 도입하기 좋고, DTO projection은 응답 계약을 더 명시적으로 통제하기 좋다.

## 언제 쓰나

- 목록 조회에서 엔티티 전체가 불필요할 때
- 읽기 전용 DTO가 분명할 때
- 연관관계 전체 로딩을 피하고 싶을 때

읽기 모델과 쓰기 모델을 분리해서 보고 싶을 때도 projection이 잘 맞는다.

## 주의점

- projection이 많아지면 repository 시그니처가 복잡해질 수 있다
- 엔티티를 다루는 것처럼 착각하면 lazy loading/조회 최적화 판단이 흐려질 수 있다
- DTO projection은 JPQL alias/constructor 규칙을 더 엄격하게 본다

## 실무 기준
- 빠르게 줄이고 싶다: interface projection
- API 계약을 명확히 고정하고 싶다: DTO projection
- 복잡한 읽기 모델이다: 아예 query layer를 분리하는 것도 검토

즉 projection은 "필드 몇 개 덜 읽는 최적화"라기보다, 읽기 모델을 별도로 의식하게 만드는 장치로 보는 편이 낫다.

## 정리

Projection은 “성능 최적화 트릭”이라기보다 **읽기 모델을 필요한 크기로 줄이는 방법**이다.  
간단하면 interface, 계약을 더 명확히 하고 싶으면 DTO projection으로 보는 편이 무난하다. 엔티티를 그대로 흘리지 않는다는 점 자체가 설계상 장점이기도 하다.

## References

- https://docs.spring.io/spring-data/jpa/reference/repositories/projections.html
