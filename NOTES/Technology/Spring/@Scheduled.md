---
id: 26
title: "@Scheduled"
summary: Spring `@Scheduled`의 실행 방식과 주기 작업 설계 시 주의할 점을 정리한 노트.
created: 2026-04-05
updated: 2026-04-05
tags:
  - java
  - spring
  - scheduling
  - scheduled
---
# @Scheduled

`@Scheduled`는 Spring에서 정해진 시간 간격이나 cron 표현식으로 메서드를 실행할 때 쓰는 기본 스케줄링 어노테이션이다.

## 한눈에 보기

- 주기 작업, 배치성 정리 작업, 캐시 갱신 등에 사용
- `fixedRate`, `fixedDelay`, `cron` 방식 제공
- 사용 전 `@EnableScheduling` 활성화 필요

## 기본 사용법

```java
@Scheduled(fixedDelay = 5000)
public void refreshCache() {
}
```

또는:

```java
@Scheduled(cron = "0 0 * * * *")
public void runHourly() {
}
```

Spring 공식 문서 기준으로 `@Scheduled`를 쓰려면 설정 클래스에 `@EnableScheduling`을 켜야 한다.

## 자주 보는 속성

| 속성 | 의미 |
| --- | --- |
| `fixedRate` | 시작 시점 기준으로 주기 실행 |
| `fixedDelay` | 이전 실행 종료 후 대기 |
| `cron` | cron 표현식 기반 스케줄 |

이 세 가지 차이를 운영 관점에서 구분하는 것이 중요하다.

- `fixedRate`: 작업이 오래 걸리면 겹침을 먼저 의식해야 한다
- `fixedDelay`: 이전 실행이 끝난 뒤 다음 실행이 시작되므로 겹침 위험은 상대적으로 적다
- `cron`: 비즈니스 시간 기준 스케줄을 표현하기 좋다

## 단일 인스턴스와 멀티 인스턴스는 다르다
`@Scheduled`는 기본적으로 "애플리케이션 인스턴스 안에서 이 메서드를 주기적으로 실행"하는 기능이다. 따라서 서버가 여러 대면 각 인스턴스가 같은 작업을 동시에 수행할 수 있다.

이 점 때문에 다음 질문이 항상 따라온다.

- 이 작업은 인스턴스마다 돌면 안 되는가
- 분산 락이 필요한가
- 외부 스케줄러가 더 맞는가

## 실무 포인트

- 작업 시간이 길면 중복 실행 가능성을 먼저 본다
- 스케줄링 메서드 안에서 외부 API/DB를 오래 잡는지 점검한다
- 단일 인스턴스 기준인지, 멀티 인스턴스 환경인지 구분해야 한다
- 장애 시 재시도 전략이 필요한지 같이 본다
- 정기 작업과 startup/bootstrap 작업을 혼동하지 않는다

## 정리

`@Scheduled`는 간단하지만 운영 영향이 큰 기능이다.  
문법보다 실행 주기, 중복 실행, 다중 인스턴스 환경을 같이 보는 게 중요하다. 로컬에서는 쉬워 보여도 운영에서는 금방 분산 작업 문제가 된다.

## References

- https://docs.spring.io/spring-framework/reference/integration/scheduling.html
