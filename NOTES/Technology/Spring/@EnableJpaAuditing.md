---
id: 23
title: "@EnableJpaAuditing"
summary: Spring Data JPA auditing을 활성화하고 생성·수정 메타데이터를 자동 채우는 기본 구성을 정리한 노트.
created: 2026-04-05
updated: 2026-04-05
tags:
  - java
  - spring-data-jpa
  - auditing
  - jpa
---
# @EnableJpaAuditing

`@EnableJpaAuditing`은 Spring Data JPA의 auditing 기능을 활성화하는 설정이다.  
생성 시각, 수정 시각, 생성자, 수정자 같은 공통 메타데이터를 자동으로 채울 때 사용한다.

## 핵심

- `@CreatedDate`, `@LastModifiedDate`, `@CreatedBy`, `@LastModifiedBy`와 함께 사용
- 설정 클래스에 `@EnableJpaAuditing`을 붙여 auditing 인프라 활성화
- 현재 사용자 추적은 `AuditorAware` bean으로 연결

## 기본 구조

Spring Data 문서 기준으로 auditing은 다음처럼 켠다.

```java
@Configuration
@EnableJpaAuditing
class Config {

    @Bean
    AuditorAware<String> auditorProvider() {
        return new AuditorAwareImpl();
    }
}
```

`AuditorAware`가 있으면 auditing infrastructure가 현재 사용자를 자동으로 가져다 쓴다.

## 보통 어떻게 구성하나

1. `AuditorAware` 구현
2. `@EnableJpaAuditing` 설정
3. `@MappedSuperclass` 기반 공통 Auditable 엔티티 작성
4. 각 엔티티가 이를 상속

예를 들면:

- `createdAt`, `updatedAt`
- `createdBy`, `modifiedBy`

같은 필드를 BaseEntity에 모아 둔다.

## 실무에서 자주 겪는 문제

기존 메모처럼 도메인 메서드에서 직접 수정자 값을 세팅하는 경우, auditing 필드와 커스텀 업데이트 필드가 섞이며 의도가 꼬일 수 있다.

예:

- framework가 관리하는 audit 필드
- 배치/시스템 처리용 별도 `updId`

이 둘을 분리해 두면 override 충돌을 줄일 수 있다.

## 정리

`@EnableJpaAuditing`은 단순 편의 기능이 아니라, **공통 변경 메타데이터를 일관되게 관리하기 위한 인프라**다.  
사용자 추적 책임은 `AuditorAware`, 도메인별 보조 필드는 별도 필드로 분리하는 편이 안전하다.

## References

- https://jizero-study.tistory.com/43
- https://web-km.tistory.com/42
- https://www.baeldung.com/database-auditing-jpa
- https://docs.spring.io/spring-data/jpa/docs/1.7.0.DATAJPA-580-SNAPSHOT/reference/html/auditing.html
- https://medium.com/@manika09singh/enable-auditing-using-spring-data-jpa-2f62587ccb23
