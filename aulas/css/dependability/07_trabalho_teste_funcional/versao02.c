#include "calcular_dano.h"

int calcular_dano(int poder_ataque, int defesa, int tipo_ataque, int eh_critico) {
    if (poder_ataque < 1 || poder_ataque > 150) return -1;
    if (defesa < 0 || defesa > 149) return -1;
    if (tipo_ataque < 1 || tipo_ataque > 3) return -1;
    if (eh_critico < 0 || eh_critico > 1) return -1;

    int dano;
    if (tipo_ataque == 1)
        dano = poder_ataque - defesa;
    else if (tipo_ataque == 2)
        dano = poder_ataque - (defesa / 2);
    else
        dano = poder_ataque;

    if (dano < 1) dano = 1;
    if (eh_critico == 1) dano = dano * 2;

    return dano;
}
