---
id: 82
title: "Spring Cloud AWS"
summary: "Spring Cloud AWS가 어떤 starter들로 구성되고, Spring Boot에서 AWS 서비스를 어떻게 통합하는지 정리한 노트."
tags:
  - technology
  - spring
  - java
  - aws
  - cloud
  - spring-cloud-aws
created: 2026-04-20
updated: 2026-04-20
---
# Spring Cloud AWS

Spring Cloud AWS는 Spring Boot 애플리케이션에서 AWS 서비스 연동을 더 Spring스럽게 쓰기 위한 통합 라이브러리다.

## 한눈에 보기

- 인증/region 선택 자동 구성
- S3, SQS, SNS, SES, Parameter Store, Secrets Manager 등 starter 제공
- 서비스별 starter를 선택적으로 추가하는 구조

## 어떻게 보나

공식 문서 기준으로 전체 코어 starter와 서비스별 starter가 나뉜다.

예:

- `io.awspring.cloud:spring-cloud-aws-starter`
- `io.awspring.cloud:spring-cloud-aws-starter-s3`
- `io.awspring.cloud:spring-cloud-aws-starter-sqs`

예를 들어 S3 통합은:

```xml
<dependency>
    <groupId>io.awspring.cloud</groupId>
    <artifactId>spring-cloud-aws-starter-s3</artifactId>
</dependency>
```

처럼 가져간다.

즉 AWS SDK를 감추는 프레임워크라기보다, Spring Boot auto-configuration 스타일로 AWS 연동을 붙이기 쉽게 만드는 starter 집합으로 보는 편이 맞다.

## 언제 유용한가

- AWS SDK를 직접 다루는 반복 설정을 줄이고 싶을 때
- Spring Boot auto-configuration과 자연스럽게 연결하고 싶을 때
- S3/SQS/SNS 같은 서비스별 통합을 모듈식으로 가져가고 싶을 때

특히 메시징, 파일 저장, 설정/시크릿 연동처럼 애플리케이션에서 자주 만나는 AWS 기능을 Spring bean 모델로 붙이기 쉬운 점이 장점이다.

## 실무 포인트

- 필요한 서비스 starter만 최소한으로 넣는다
- 인증/권한/region 전략은 인프라 환경과 같이 봐야 한다
- 버전은 release note와 공식 문서를 같이 보며 맞춘다
- 추상화가 편하다고 해서 AWS 개념 자체를 모르고 쓰면 운영에서 막힌다

## 왜 서비스별 starter만 선택하는 편이 좋은가
모든 의존성을 한 번에 넣기보다 필요한 서비스 starter만 가져가는 편이 classpath와 설정 범위를 줄이고, 애플리케이션 책임도 더 분명해진다. 특히 AWS 연동은 권한, 네트워크, region, IAM 정책과 묶여 있으므로 "편한 추상화"보다 "명시적인 통합"이 더 중요할 때가 많다.

## 정리

Spring Cloud AWS는 AWS를 완전히 숨기는 도구가 아니라, Spring Boot 스타일로 AWS integration을 붙이기 쉽게 만드는 starter 모음이다. 편의는 크지만, 권한/region/서비스 개념까지 같이 이해하고 써야 운영에서 안정적이다.

## References

- https://github.com/awspring/spring-cloud-aws/releases
- https://docs.awspring.io/spring-cloud-aws/docs/3.4.0/reference/html/index.html#getting-started
