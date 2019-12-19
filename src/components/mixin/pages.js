const mixin = {
    data() {
        return {}
    },
    methods: {
        loadPage(routerName, param) {
            if (param) {
                this.$router.push({ name: routerName, query: param })
            } else {
                this.$router.push({ name: routerName })
            }
        }
    },
    created() {
        console.log('全局混入')
    }
}
export default mixin