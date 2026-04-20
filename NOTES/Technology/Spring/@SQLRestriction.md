---
id: 27
title: "@SQLRestriction"
summary: Hibernate `@SQLRestriction`으로 엔티티 조회 시 항상 붙는 필터 조건을 다루는 방법을 정리한 노트.
created: 2026-04-05
updated: 2026-04-05
tags:
  - java
  - hibernate
  - sqlrestriction
---
# @SQLRestriction

`@SQLRestriction`은 Hibernate가 엔티티나 연관 컬렉션을 읽을 때 **항상 붙일 SQL 조건**을 선언하는 어노테이션이다.

## 한눈에 보기

- soft delete나 상태 기반 row filtering에 자주 사용
- 읽기 시점에 조건이 자동으로 붙는다
- 항상 적용되며 비활성화하거나 파라미터화할 수 없다

## 어떤 느낌으로 쓰나

예를 들어 삭제 플래그가 있는 데이터에서:

```java
@SQLRestriction("status <> 'DELETED'")
```

처럼 선언하면, Hibernate가 해당 엔티티나 컬렉션을 로딩할 때 이 제약을 계속 적용한다.

즉 repository 메서드마다 같은 조건을 반복하지 않고, 매핑 수준에 "이 엔티티는 기본적으로 이런 제약을 갖는다"를 박아 넣는 방식이다.

## 장점과 한계

| 항목 | 설명 |
| --- | --- |
| 장점 | 전역적으로 일관된 읽기 제약을 붙이기 쉬움 |
| 한계 | 동적으로 끄거나 값을 바꿀 수 없음 |

Hibernate 문서 기준으로 `@SQLRestriction`은 **always applied** 되며 disabled/parameterized 할 수 없다.  
즉, 유연한 필터링보다 고정 제약에 가깝다.

## `@Where`와 비슷하지만 다른가
현업에서는 soft delete를 말할 때 `@Where`를 먼저 떠올리는 경우가 많다. `@SQLRestriction`도 비슷한 문제를 풀지만, Hibernate가 제공하는 "항상 적용되는 읽기 제약"이라는 점이 핵심이다. 중요한 건 이름보다도 "동적으로 바뀌지 않는 매핑 레벨 제약"이라는 성격이다.

## 언제 쓰고 언제 안 쓰나

- 쓰기 좋은 경우:
  - soft delete row를 기본 조회에서 숨길 때
  - 특정 상태만 항상 보여야 할 때
- 덜 맞는 경우:
  - 요청별/사용자별로 조건을 바꿔야 할 때
  - 운영 중 동적으로 on/off 해야 할 때

이런 동적 요구에는 Hibernate filter가 더 유연하다.

## 실무 포인트
- "항상 숨겨야 하는 데이터"인지 먼저 판단한다
- 관리자 화면처럼 예외 조회가 필요한 경우엔 매핑 수준 제약이 오히려 불편할 수 있다
- soft delete를 단순 편의가 아니라 조회 정책으로 보고 설계해야 한다

## 정리

`@SQLRestriction`은 **고정된 읽기 제약을 엔티티 매핑 수준에 박아 두는 기능**으로 이해하면 된다.  
간단하고 강하지만 유연성은 낮다. 그래서 전역 기본 정책에는 잘 맞고, 요청별로 바뀌는 정책에는 잘 안 맞는다.

## References

- https://docs.jboss.org/hibernate/stable/orm/javadocs/org/hibernate/annotations/SQLRestriction.html
