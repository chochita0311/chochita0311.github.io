---
id: 42
title: "Java File Size in Bytes"
summary: "Java에서 파일 크기를 byte 단위로 구하는 대표 방법과 새 코드에서 `Files.size()`를 기본으로 보는 이유를 정리한 노트."
tags:
  - technology
  - java
created: 2026-04-20
updated: 2026-04-20
---
# Java File Size in Bytes

파일 크기를 구하는 일 자체는 단순하지만, 자바에서는 오래된 `File` API를 쓸지 NIO의 `Path`/`Files` API를 쓸지 함께 결정하게 된다. 새 코드에서는 보통 NIO 쪽이 더 자연스럽다.

## 가장 흔한 두 가지 방법

```java
long size1 = new File("report.csv").length();
long size2 = Files.size(Path.of("report.csv"));
```

둘 다 byte 단위 크기를 구할 수 있다. 하지만 새 코드 기준으로는 `Files.size(Path)`가 더 자주 권장된다.

## 왜 `Files.size()`를 기본으로 보나
`Path` 기반 코드는 존재 여부 확인, 복사, 이동, 권한 조작 같은 다른 NIO API와 흐름이 맞는다. 따라서 크기 조회만 old IO 스타일로 따로 갈 이유가 크지 않다.

예를 들어 아래처럼 파일 존재 확인과 함께 읽기 쉽다.

```java
Path path = Path.of("report.csv");
if (Files.exists(path)) {
    long size = Files.size(path);
}
```

## `File.length()`도 틀린 것은 아니다
레거시 코드나 단순 예제에서는 `File.length()`도 충분히 쓸 수 있다. 중요한 것은 새 코드에서 경로 처리 전반을 `Path` 중심으로 맞추는 편이 유지보수에 더 낫다는 점이다.

## 주의할 점
여기서 말하는 size는 "개별 파일 엔트리의 크기"다. 디렉터리 전체 용량 계산, 압축 해제 후 실제 사용량, sparse file 처리 같은 문제는 별도 주제다.

또한 존재하지 않는 파일, 접근 권한 부족 같은 예외 상황은 항상 같이 다뤄야 한다.

## 실무 기준
- 새 코드: `Files.size(Path)` 우선
- 레거시 `File` 중심 코드: `length()`도 허용
- 디렉터리 용량 계산: 별도 순회 로직 필요

즉 이 주제는 API 선택보다 "무슨 크기를 알고 싶은가"를 먼저 분명히 하는 것이 중요하다.

## 파일 업로드/다운로드 문맥에서 자주 쓰인다
업로드 제한 검사, 다운로드 응답 헤더 설정, 로그 파일 관리처럼 byte 단위 크기를 판단해야 하는 경우가 많다. 그래서 간단한 API라도 예외 처리와 존재 여부 확인을 함께 다루는 습관이 중요하다.

## 정리
파일 크기가 필요하면 `Files.size(Path)`를 먼저 떠올리면 된다. `File.length()`도 가능하지만, 새 코드 기준으로는 NIO 쪽이 더 일관되고 확장하기 쉽다.

## References
- [Techie Delight: Get file size in bytes in Java](https://www.techiedelight.com/get-file-size-bytes-java/)
