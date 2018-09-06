export default function(rowsPerPage) {
    return {
        page: 1,
        rowsPerPage,
        descending: null,
        sortBy: null,
        totalItems: 0
    }
}