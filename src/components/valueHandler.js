export function saveValue(target, value, key){
    if (!value) return;
    var localStorageTarget = localStorage[target];

    if (!localStorageTarget){
        localStorageTarget = JSON.stringify([]);
    }

    var json = JSON.parse(localStorageTarget);
    json.push({ key: key, value: value });

    localStorage[target] = JSON.stringify(json);
};

export function loadValues(target, callback){
    var localStorageTarget = localStorage[target] || '[]';

    var div       = document.createElement('div');
    var container = document.createElement('div');
    var h1        = document.createElement('h1');
    var ul        = document.createElement('ul');
    var close     = document.createElement('button');

    div.setAttribute('id', target);
    div.setAttribute('data-target', target);
    div.setAttribute('class', 'select-overlay fadein');

    container.setAttribute('class', 'container mt-5');

    h1.setAttribute('class', 'font-weight-bold');

    ul.setAttribute('class', 'list-group');

    close.setAttribute('type', 'button');
    close.setAttribute('class', 'close');
    close.setAttribute('aria-label', 'Close');
    close.addEventListener('click', function(){
        if (document.querySelector('.select-overlay')){
            closeModal();
        }
    }, false);

    div.style.position   = 'fixed';
    div.style.zIndex     = 1070;
    div.style.top        = 0;
    div.style.left       = 0;
    div.style.width      = '100%';
    div.style.height     = '100%';
    div.style.background = 'rgba(255,255,255,0.9)';

    container.style.position = 'relative';

    h1.innerHTML = target;

    close.innerHTML      = '<span aria-hidden="true">&times;</span>';
    close.style.position = 'absolute';
    close.style.right    = '15px';
    close.style.top      = '-25px';

    JSON.parse(localStorageTarget).forEach((d) => {
        var li   = document.createElement('li');
        var span = document.createElement('span');

        li.innerHTML   = d.key;
        span.innerHTML = '<i class="fa fa-trash-o" aria-hidden="true"></i>';
        span.addEventListener('click', (e) => {
            erase(e, target, d.key, d.value);
        }, false);

        li.setAttribute('class', 'list-group-item list-group-item-action list-group-item-primary text-dark d-flex justify-content-between align-items-center');
        li.setAttribute('data-content', d.value);
        li.addEventListener('click', (e) => {
            select(e, callback);
        }, false);

        span.setAttribute('class', 'hint--bottom hint--rounded');
        span.setAttribute('aria-label', 'delete ' + d.key);

        li.style.cursor    = 'pointer';
        span.style.padding = ' 5px 10px';

        li.appendChild(span);
        ul.appendChild(li);
    });

    container.appendChild(h1);
    container.appendChild(close);

    if (JSON.parse(localStorageTarget).length === 0){
        var p = document.createElement('p');
        p.setAttribute('class', 'text-muted');
        p.innerHTML = 'no data was found.';
        container.appendChild(p);
    }

    container.appendChild(ul);
    div.appendChild(container);
    document.body.appendChild(div);
    document.body.addEventListener('keyup', (e) => {
        var code = (e.keyCode ? e.keyCode : e.which);
        if (code === 27 && document.querySelector('.select-overlay')){
            closeModal();
        }
    });
};

function closeModal(){
    var modal = document.querySelector('.select-overlay');

    modal.setAttribute('class', 'select-overlay fadeout');

    setTimeout(() => {
        document.body.removeChild(modal);
    }, 340);
}

function select(e, callback){
    var el      = document.querySelector('.select-overlay');
    var content = e.target.getAttribute('data-content');
    document.body.removeChild(el);
    callback(content);
}

function erase(e, target, key, value){
    e.stopPropagation();

    var el   = e.target.parentNode.parentNode;
    var data = JSON.parse(localStorage[target]);

    el.parentNode.removeChild(el);

    data.forEach((d, i) => {
        if (d.key === key && d.value === value){
            data.splice(i, 1);
        }
    });

    localStorage[target] = JSON.stringify(data);
}
