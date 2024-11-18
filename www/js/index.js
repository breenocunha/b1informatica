fetch('js/backend.json')
.then(response => response.json())
.then(data=> {
    //Salvar os dados localmente
    //Utilizando o LocalStorage
    localStorage.setItem('produtos', JSON.stringify(data));
    console.log('Dados do produtos salvos!');

    //Simular carregamento online
    setTimeout(() => {

        //Esvaziar a área de Produtos
        $("#produtos").empty();

        data.forEach(produto => {
            var produtoHTML = `
            <!--Item Card-->
            <div class="item-card">
                <a data-id="${produto.id}" href="/detalhes/" class="item">
                    <div class="img-container">
                        <img src="${produto.imagem}" alt="">
                    </div>
                    <div class="nome-rating">
                        <span class="color-gray">${produto.nome}</span>
                        <span class="bold margin-right">
                            <i class="mdi mdi-star"></i>
                            ${produto.rating}
                        </span>
                    </div>
                    <div class="price">${produto.preco_promocional.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</div>
                </a>                
            </div>
            `;
    
            $("#produtos").append(produtoHTML)
        });

        $(".item").on('click', function() {
            var id = $(this).attr('data-id');
            localStorage.setItem('detalhe', id);
            app.views.main.router.navigate('/detalhes/');
        })

    }, 1000);


})
.catch(error => console.error('Erro ao fazer fetch dos dados: '+error));

//Item dentro do Carrinho
setTimeout(() => {
    var carrinho = JSON.parse(localStorage.getItem('carrinho'));

    //Incremetar o indice da Sacolinha
    $('.btn-cart').attr('data-count', carrinho.length);
}, 300);