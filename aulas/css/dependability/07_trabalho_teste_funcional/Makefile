CC = gcc
CFLAGS = -Wall -O0 -std=c99

SOURCES = correto.c versao01.c versao02.c versao03.c versao04.c \
          versao05.c versao06.c versao07.c versao08.c versao09.c versao10.c
OBJECTS = $(SOURCES:.c=.o)

all: objects pdf

objects: $(OBJECTS)

%.o: %.c calcular_dano.h
	$(CC) $(CFLAGS) -c -o $@ $<

pdf: main.tex
	pdflatex main.tex && pdflatex main.tex

clean:
	rm -f $(OBJECTS) *.aux *.log *.out *.pdf

.PHONY: all objects pdf clean
