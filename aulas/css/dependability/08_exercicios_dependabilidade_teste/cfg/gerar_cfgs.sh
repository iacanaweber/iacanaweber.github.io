#!/bin/bash
# Gera imagens CFG para os exercícios 18, 19 e 20
# Requer: gcc, graphviz (sudo apt-get install -y graphviz)

set -e
cd "$(dirname "$0")"

for src in ex18_verificar_acesso.c ex19_calcular_bonus.c ex20_processar.c; do
    name="${src%.c}"
    echo "Gerando CFG para $src..."

    # Compila e gera o .dot
    gcc -O0 -g -fdump-tree-cfg-graph -c "$src" -o /dev/null

    # O GCC gera um arquivo com nome parecido com *.c.???t.cfg.dot
    dot_file=$(ls ${src}.* 2>/dev/null | grep -i "cfg" | head -1)

    if [ -z "$dot_file" ]; then
        # Tenta padrão alternativo do GCC (pasta atual)
        dot_file=$(find . -maxdepth 1 -name "*.dot" -newer "$src" 2>/dev/null | head -1)
    fi

    if [ -n "$dot_file" ]; then
        dot -Tpng "$dot_file" -o "${name}_cfg.png"
        echo "  Imagem gerada: ${name}_cfg.png"
        rm -f "$dot_file"
    else
        echo "  AVISO: arquivo .dot não encontrado para $src"
    fi
done

# Limpa arquivos auxiliares do GCC
rm -f *.c.???t.* *.gcno *.o
echo "Concluído."
