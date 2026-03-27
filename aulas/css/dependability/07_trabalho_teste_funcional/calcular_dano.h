#ifndef CALCULAR_DANO_H
#define CALCULAR_DANO_H

/* Calcula o dano de um ataque em combate de RPG.
   Retorna o dano final ou -1 se algum parametro for invalido. */
int calcular_dano(int poder_ataque, int defesa, int tipo_ataque, int eh_critico);

#endif
