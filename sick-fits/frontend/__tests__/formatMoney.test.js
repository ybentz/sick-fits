import formatMoney from '../lib/formatMoney'

describe('Format Money', ()=> {
    it('should work with fractional dollars', () => {
        expect(formatMoney(1)).toEqual('$0.01')
        expect(formatMoney(10)).toEqual('$0.10')
        expect(formatMoney(9)).toEqual('$0.09')
        expect(formatMoney(40)).toEqual('$0.40')
    })

    it('should leave cents off for whole dollars', () => {
        expect(formatMoney(100)).toEqual('$1')
        expect(formatMoney(10000000)).toEqual('$100,000')
    })

    it('should work with dollars and cents', () => {
        expect(formatMoney(101)).toEqual('$1.01')
        expect(formatMoney(10000001)).toEqual('$100,000.01')
        expect(formatMoney(10000050)).toEqual('$100,000.50')
        expect(formatMoney(10000054)).toEqual('$100,000.54')
    })
})