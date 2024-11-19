var localCarrinho = localStorage.getItem('carrinho');

if(localCarrinho) {
    var carrinho = JSON.parse(localCarrinho);
    if(carrinho.length > 0) {
        //Tem itens no carrinho
        //Mostrar o carrinho
        renderizarCarrinho();
        //Somar total do carrinho
        calcularTotal();
    }else {
        //Mostrar Carrinho vazio
        carrinhoVazio();
    }
}else {
    //Mostrar carrinho vazio
    carrinhoVazio();
}

function renderizarCarrinho() {
    //Esvaziar a área dos itens
    $("#listaCarrinho").empty();

    //Percorrer o nosso Carrinho e alimentar a área
    $.each(carrinho, function(index, itemCarrinho){
        var itemDiv = `
        <!--Item do Carrinho-->
        <div class="item-carrinho">
            <div class="area-img">
                <img src="${itemCarrinho.item.imagem}">
            </div>
            <div class="area-details">
                <div class="sup">
                    <span class="name-prod">
                        ${itemCarrinho.item.nome}
                    </span>
                    <a data-index="${index}" class="delete-item" href="#">
                        <i class="mdi mdi-close"></i>
                    </a>
                    </div>
                    <div class="middle">
                        <span>${itemCarrinho.item.principal_caracteristica}</span>
                    </div>
                    <div class="preco-quantidade">
                        <span>${itemCarrinho.item.preco_promocional.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</span>
                    <div class="count">
                        <a href="#" class="minus" data-index="${index}">-</a>
                        <input readonly class="qtd-item" type="text" value="${itemCarrinho.quantidade}">
                        <a href="#" class="plus" data-index="${index}">+</a>
                    </div>
                </div>
            </div>
        </div>
        `;

        $("#listaCarrinho").append(itemDiv);
    });

    $(".delete-item").on('click', function() {
        var index = $(this).data('index');
        //Confirmar
        app.dialog.confirm('Tem certeza que quer remover o item?', 'Remover', function(){          
            carrinho.splice(index, 1);
            localStorage.setItem('carrinho', JSON.stringify(carrinho));
            app.views.main.router.refreshPage();
        });
    });

    $(".minus").on('click', function() {
        var index = $(this).data('index');
        
        if(carrinho[index].quantidade >1) {
            carrinho[index].quantidade--;
            carrinho[index].total_item = carrinho[index].quantidade * carrinho[index].item.preco_promocional;
            localStorage.setItem('carrinho', JSON.stringify(carrinho));
            renderizarCarrinho();
            calcularTotal();
        }else {
            var itemname = carrinho[index].item.nome;
            app.dialog.confirm(`Gostaria de remover <strong>${itemname}</strong>?`, 'Remover', function() {
                carrinho.splice(index, 1);
                localStorage.setItem('carrinho', JSON.stringify(carrinho));
                renderizarCarrinho();
                calcularTotal();
            });
        }
    });

    $(".plus").on('click', function() {
        var index = $(this).data('index');
        
        carrinho[index].quantidade++;
        carrinho[index].total_item = carrinho[index].quantidade * carrinho[index].item.preco_promocional;
        localStorage.setItem('carrinho', JSON.stringify(carrinho));
        renderizarCarrinho();
        calcularTotal();
        
    });

}

function calcularTotal() {
    var totalCarrinho = 0;
    $.each(carrinho, function (index, itemCarrinho) {
        totalCarrinho += itemCarrinho.total_item;
    });
    $("#subtotal").html(totalCarrinho.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'}));
}

function carrinhoVazio() {
    console.log('Carrinho está vazio');

    $("#listaCarrinho").empty();

    //Sumir os itens e botões
    $("#toolbarTotais").addClass('display-none');
    $("#toolbarCheckout").addClass('display-none');

    $("#listaCarrinho").html(`
        <div class="text-align-center">
            <img width="300" src="img/empty.gif">
            <br><span class="color-gray">Nada por enquanto...</span>
        </div>    
    `);
}

$("#esvaziar").on('click', function(){
    app.dialog.confirm('Tem certeza que quer esvaziar o carrinho?', 'Esvaziar Carrinho', function(){
        //Apagar o localStorage do Carrinho
        localStorage.removeItem('carrinho');
        app.views.main.router.refreshPage();
    });
})

