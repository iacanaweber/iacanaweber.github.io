int verificar_acesso(int nivel, int autenticado) {
    int resultado = 0;
    if (nivel >= 3 && autenticado == 1) {
        resultado = 1;
    }
    if (nivel >= 5) {
        resultado = 2;
    }
    return resultado;
}
