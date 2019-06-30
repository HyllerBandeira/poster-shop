let LOAD_NUM = 4
let productListBottomWatcher

const app = new Vue({
    el: '#app',
    data: {
        cart: [],
        loading: false,
        products: [],
        results: [],
        search: 'cat',
        lastSearch: '',
        total: 0,
    },
    methods: {
        addToCart(product) {
            this.total += product.price

            let cart_item = this.cart.find((item) => item.id === product.id)

            if (typeof cart_item !== 'undefined') {
                cart_item.qty++ 
            } else {
                product.qty = 1
                this.cart.push(product)
            }
        },
        appendResults() {
            if (this.products.length < this.results.length) {
                this.products = this.results.slice(
                    0,
                    LOAD_NUM + this.products.length
                )
            }
        },
        dec(product) {
            let cart_item = this.cart.find((item) => item.id === product.id)
            cart_item.qty--
            if (cart_item.qty <= 0) {
                this.cart = this.cart.filter((item) => item.id !== cart_item.id)
            }
            this.total -= product.price
        }, 
        inc(product) {
            product.qty++
            this.total += product.price
        },
        onSubmitSearch() {
            this.products = []
            this.results = []
            this.loading = true
            const path = '/search?q='.concat(this.search)
            this.$http.get(path).then((response) => {
                this.results = response.body
                this.appendResults()
                this.lastSearch = this.search
                this.loading = false
            }).catch((error) => {
                console.log('error', error)
            })
        }
    },
    filters: {
        moneyFormat(price) {
            return '$'+price.toFixed(2)
        }
    },
    created() {
        this.onSubmitSearch()
    },
    beforeUpdate() {
        if (typeof productListBottomWatcher !== 'undefined') {
            productListBottomWatcher.destroy()
            productListBottomWatcher = undefined
        }
    },
    updated() {
        const productListBottomSensor = document.querySelector('#product-list-bottom')
        productListBottomWatcher = scrollMonitor.create(productListBottomSensor)

        productListBottomWatcher.enterViewport(this.appendResults)
    }
})
