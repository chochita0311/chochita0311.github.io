---
id: 40
title: "Java File IO Basics"
summary: "Java 파일 입출력에서 try-with-resources, `Files` API, 디렉터리 생성과 자원 정리의 기본 원칙을 정리한 노트."
tags:
  - technology
  - java
created: 2026-04-20
updated: 2026-04-20
---
# Java File IO Basics

파일 I/O에서 가장 중요한 기본값은 자원을 확실히 닫는 것이다. 그래서 `try-with-resources`는 사실상 표준 패턴으로 보는 편이 맞다.

## 가장 기본이 되는 쓰기 패턴

```java
Path path = Path.of("logs/app.txt");
Files.createDirectories(path.getParent());

try (BufferedWriter writer = Files.newBufferedWriter(path)) {
    writer.write("hello");
    writer.newLine();
}
```

위 코드에는 파일 I/O의 핵심 기본기가 거의 다 들어 있다.

- 상위 디렉터리를 먼저 준비한다.
- 자원은 `try-with-resources`로 닫는다.
- 가능하면 `File`보다 `Path`와 `Files` API를 사용한다.

## 왜 `try-with-resources`가 사실상 기본인가
링크 문서들이 공통으로 보여 주는 부분은 자원 정리 누락이 생각보다 쉽게 발생한다는 점이다. 스트림을 닫지 않으면 파일 핸들이 남고, flush나 close 타이밍이 어긋나면 운영 환경에서 문제를 재현하기도 어렵다.

```java
try (InputStream in = Files.newInputStream(Path.of("input.txt"));
     OutputStream out = Files.newOutputStream(Path.of("output.txt"))) {
    in.transferTo(out);
}
```

이 패턴은 읽기/쓰기 모두에서 기본값으로 삼는 편이 좋다.

## 디렉터리 준비를 자주 놓친다
`FileOutputStream`은 대상 파일이 없으면 만들 수 있지만, 상위 디렉터리까지 자동 생성해 주지는 않는다. 그래서 파일 쓰기 전에 경로를 준비하지 않으면 `FileNotFoundException`이나 경로 관련 예외가 난다.

이럴 때는 `mkdirs()`보다 `Files.createDirectories()`가 새 코드 기준으로 더 일관되다.

## 새 코드 기준
가능하면 old IO API만 고집하기보다 `Path`와 `Files`를 중심으로 보는 편이 낫다. 경로 조합, 디렉터리 생성, 파일 존재 확인, 예외 처리 흐름이 더 일관되기 때문이다.

## 실무 기준
- 새 코드 기본값: `Path` + `Files`
- 자원 정리: `try-with-resources`
- 파일 생성 전: 부모 디렉터리 준비
- 대량 복사/읽기: buffer와 stream 조합 검토

## 정리
파일 I/O의 핵심은 "읽고 쓴다"보다 자원 정리와 경로 준비를 정확히 하는 것이다. 그래서 `try-with-resources`와 `Files.createDirectories()` 같은 기본기가 가장 먼저 중요하다.

## References
- [Baeldung: Try-with-resources](https://www.baeldung.com/java-try-with-resources)
- [Jenkov: FileOutputStream](https://jenkov.com/tutorials/java-io/fileoutputstream.html)
- [Baeldung: OutputStream](https://www.baeldung.com/java-outputstream)
- [Stack Overflow: `FileOutputStream` create file if not exists](https://stackoverflow.com/questions/9620683/java-fileoutputstream-create-file-if-not-exists)
- [DelftStack: Create Directory in Java](https://www.delftstack.com/howto/java/create-directory-java/)
- [HowToDoInJava: Creating New Directories](https://howtodoinjava.com/java/io/create-directories/)
