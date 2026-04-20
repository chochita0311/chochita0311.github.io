---
id: 46
title: "JVM Option Basics"
summary: "JVM 옵션을 시스템 속성, 메모리, GC, 진단 플래그 관점에서 분류해 읽는 기준을 정리한 노트."
tags:
  - technology
  - java
created: 2026-04-20
updated: 2026-04-20
---
# JVM Option Basics

JVM 옵션은 많아 보이지만, 실제로는 몇 가지 큰 축으로 나누면 읽기 쉬워진다. 시스템 속성(`-D`), 힙/메타스페이스 같은 메모리 설정, GC 선택, 진단용 플래그로 먼저 구분하면 된다.

## 왜 분류가 중요한가
운영에서는 옵션을 많이 외우는 것보다, 현재 프로세스에 무엇이 실제로 적용됐는지 읽어내는 능력이 더 중요하다. 특히 메모리와 GC 옵션은 서로 연결돼 있어서 하나만 떼어 보면 오해하기 쉽다.

## 실무에서 자주 보는 축
- 시스템 속성: 앱 동작 스위치
- 메모리: `-Xms`, `-Xmx`, metaspace 관련
- GC: 어떤 collector를 쓰는지
- 진단: 로그, dump, 추적용 플래그

이렇게 분리하면 옵션이 "잡다한 문자열"이 아니라 목적별 설정 묶음으로 읽힌다.

## 메모리 옵션 예제

```bash
-Xms2G -Xmx2G -XX:MaxMetaspaceSize=512m
```

Baeldung 문서가 정리하듯 `-Xms`와 `-Xmx`는 힙 크기, `MaxMetaspaceSize`는 메타스페이스 상한을 다룬다. 즉 "메모리 옵션" 안에서도 힙과 클래스 메타데이터 저장 영역을 구분해서 봐야 한다.

## GC 옵션을 따로 봐야 하는 이유

```bash
-XX:+UseG1GC
```

GC 선택은 단순 성능 튜닝이 아니라 지연 시간, 처리량, 로그 해석 방식에 영향을 준다. 그래서 힙 크기만 맞추고 GC를 무시하면, 실제 운영 특성과 맞지 않는 설정이 될 수 있다.

## 진단 옵션도 운영 품질에 중요하다
OutOfMemoryError가 났을 때 heap dump가 없으면 원인 추적이 훨씬 어려워진다.

```bash
-XX:+HeapDumpOnOutOfMemoryError
-XX:HeapDumpPath=/var/log/app.hprof
```

GC 로그, 힙 덤프, 에러 시 실행할 명령 같은 옵션은 평소에는 눈에 덜 띄지만 장애 대응 때 가장 값진 정보가 된다.

## 실무 기준
- 옵션을 외우기보다 목적별로 분류
- 메모리, GC, 진단 옵션은 함께 읽기
- 실제 프로세스 적용값과 배포 환경 기본값을 구분

## 정리
JVM 옵션은 개별 플래그를 암기하는 것보다, 메모리/GC/시스템 속성/진단이라는 큰 축으로 읽는 편이 훨씬 실용적이다. 그리고 항상 실제 프로세스 적용값을 기준으로 판단해야 한다.

## References
- [Baeldung: Most Important JVM Parameters](https://www.baeldung.com/jvm-parameters)
- [Baeldung: JVM Garbage Collectors](https://www.baeldung.com/jvm-garbage-collectors)
- [How to find JVM flag?](https://mangchhe.github.io/java/2024/03/04/how-to-find-jvm-flag/)
- [JVM Option 설정에 대하여](https://nesoy.github.io/blog/2019-08-12-JVM-Options)
