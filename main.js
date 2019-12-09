var view;

var spec = './map-bar.vl.json';
var spec1 = './bethold.vl.json';

vegaEmbed("#p_value", spec1).then( _ => {

}).catch(console.error);

vegaEmbed('#vis', spec).then( ({view}) => {
    // console.log(view);
    const data = view.data('am').slice();
    let svg = initD3(data);
    // console.log(view.getState())
    function signalEventHanlder (handler) {
        view.addSignalListener('brush1', (name, value) => {
            handler({name,value})
        })
    }
    const signalEvent = Rx.Observable.fromEventPattern(
        signalEventHanlder
    );
    // console.log(signalEvent)
    const eventDebounced = signalEvent.debounceTime(500)
    eventDebounced.subscribe(({name, value}) => {
        // console.log(name, value)
        const key = Object.keys(value)[0];
        let filtered = [];
        if (!key) {
            filtered = data;
        } else {
            filtered = _.filter(data, n => {
                const idx = _.indexOf(value[key], n[key])
                if (idx >= 0) return true;
                return false;
            });
        }
        if (svg) {
            d3.select('#circle_packing svg').remove();
            d3.select('#treemap svg').remove();
        }
        svg = initD3(filtered);
        // console.log(filtered)
    })
}).catch(console.error)


const geomap = document.getElementsByClassName('density_geomap')[0];
const closebtn = document.getElementsByClassName('close_btn')[0];
// console.log(geomap)
geomap.addEventListener('click', (evt) => {
    closebtn.classList.remove('hidden');
    const container = document.createElement('container');
    container.classList.add('geomap');
    const iframe = document.createElement('iframe');
    iframe.src = './density-geomap.html';
    container.appendChild(iframe);
    document.body.appendChild(container);
})

closebtn.addEventListener('click', evt => {
    const geomap = document.querySelector('.geomap');
    if (geomap) {
        geomap.parentElement.removeChild(geomap);
        closebtn.classList.add('hidden');
    }
})