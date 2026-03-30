int calcular_bonus(int vendas, int tempo_empresa) {
    int bonus = 0;
    if (vendas > 100 || tempo_empresa > 5) {
        bonus = 500;
        if (vendas > 200 && tempo_empresa > 10) {
            bonus = 1500;
        }
    }
    return bonus;
}
