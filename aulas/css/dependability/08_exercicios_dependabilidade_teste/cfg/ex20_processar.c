int processar(int a, int b) {
    int r = a;
    if (a > b) {
        r = a - b;
    } else {
        r = b - a;
    }
    if (r == 0) {
        r = -1;
    }
    return r;
}
