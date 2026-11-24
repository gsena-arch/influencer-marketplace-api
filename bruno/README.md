# Coleção Bruno

Abra esta pasta como uma coleção no Bruno. Os endpoints estão configurados
diretamente para `https://influencer-marketplace-api.onrender.com`.

Para criar 10 registros em cada entidade:

1. abra o Collection Runner;
2. selecione a coleção inteira;
3. escolha `data/10-registros.json` em **Run with Parameters**;
4. mantenha a execução sequencial e a ordem original;
5. execute a coleção.

Cada linha do arquivo gera um conjunto completo de dez entidades relacionadas.
Os IDs retornados são salvos como variáveis de runtime e utilizados nos POSTs
seguintes da mesma iteração.

Para executar novamente no mesmo banco, altere os valores de `sufixo`, pois o
e-mail do usuário e o código do curso precisam ser únicos.
