/**
 * Copyright Blake Loring <blake_l@parsed.uk> 2015
 */
"use strict";

import Z3 from './Z3Loader';
import Z3Utils from './Z3Utils';
import Expr from './Expr';
import Model from './Model';

class Context {

    constructor() {
          let config = Z3.Z3_mk_config();
          Z3.Z3_set_param_value(config, "model", "true");
          Z3.Z3_set_param_value(config, "MODEL", "true");
          Z3.Z3_set_param_value(config, "well_sorted_check", "true");

          this.ctx = Z3.Z3_mk_context_rc(config);
          Z3.Z3_del_config(config);
    }

    _build(func, ...args) {
        let fnResult = func.apply(this, [this.ctx].concat(Z3Utils.astArray(args)));
        return new Expr(this.ctx, fnResult);
    }

    _buildVar(func, ...args) {
        return this._buildVarNoArgs(func, args);
    }
    
    _buildVarNoArgs(func, args) {
        return new Expr(this.ctx, func(this.ctx, args.length, Z3Utils.astArray(args)));
    }

    destroy() {
        Z3.Z3_del_context(this.ctx);
    }

    mkVar(name, sort) {
        return new Expr(this.ctx, Z3.Z3_mk_const(this.ctx, this.mkStringSymbol(name), sort));
    }

    mkIntVar(name) {
        return this.mkVar(name, this.mkIntSort());
    }

    mkRealVar(name) {
        return this.mkVar(name, this.mkRealSort());
    }

    mkBoolVar(name) {
        return this.mkVar(name, this.mkBoolSort());
    }

    mkStringSort() {
        return Z3.Z3_mk_string_sort(this.ctx);
    }

    mkString(val) {
        return new Expr(this.ctx, Z3.Z3_mk_string(this.ctx, val));
    }

    mkSeqLength(val) {
        return this._build(Z3.Z3_mk_seq_length, val);
    }
    
    mkSeqAt(val, off) {
        return this._build(Z3.Z3_mk_seq_at, val, off);
    }
   
    mkSeqContains(val1, val2) {
        return this._build(Z3.Z3_mk_seq_contains, val1, val2);
    }
    
    mkSeqConcat(strings) {
        return this._buildVarNoArgs(Z3.Z3_mk_seq_concat, strings);
    }
    
    mkSeqSubstr(str, offset, length) {
        return this._build(Z3.Z3_mk_seq_extract, str, offset, length);
    }
    
    mkSeqIndexOf(str, str2, off) {
        return this._build(Z3.Z3_mk_seq_index, str, str2, off);
    }

    isString(ast) {
        return Z3.Z3_is_string(this.ctx, ast) === Z3.TRUE;
    }

    mkBoolSort() {
        return Z3.Z3_mk_bool_sort(this.ctx);
    }

    mkIntSort() {
        return Z3.Z3_mk_int_sort(this.ctx);
    }

    mkIntSymbol(val) {
        return Z3.Z3_mk_int_symbol(this.ctx, val);
    }

    mkStringSymbol(val) {
        return Z3.Z3_mk_string_symbol(this.ctx, val);
    }

    mkConst(symb, sort) {
        return new Expr(this.ctx, Z3.Z3_mk_const(this.ctx, symb, sort));
    }

    /**
     * Propositional logic and equality
     */

    mkTrue() {
        return new Expr(this.ctx, Z3.Z3_mk_true(this.ctx));
    }

    mkFalse() {
        return new Expr(this.ctx, Z3.Z3_mk_false(this.ctx));
    }

    mkEq(left, right) {
        return this._build(Z3.Z3_mk_eq, left, right);
    }
    
    mkRealToInt(real) {
        return this._build(Z3.Z3_mk_real2int, real);
    }

    //missing: distinct

    mkNot() {
        return this._build(Z3.Z3_mk_not, arg);
    }

    mkNot(arg) {
        return this._build(Z3.Z3_mk_not, arg);
    }

    mkIte(ifarg, thenarg, elsearg) {
        return this._build(Z3.Z3_mk_ite, ifarg, thenarg, elsearg);
    }

    mkIff(left, right) {
        return this._build(Z3.Z3_mk_iff, left, right);
    }

    mkImplies(left, right) {
        return this._build(Z3.Z3_mk_implies, left, right);
    }

    mkXor(left, right) {
        return this._build(Z3.Z3_mk_xor, left, right);
    }

    mkAnd(left, right) {
        return this._buildVar(Z3.Z3_mk_and, left, right);
    }

    mkOr(left, right) {
        return this._buildVar(Z3.Z3_mk_or, left, right);
    }

    /**
     * Arithmetic: Integers and Reals
     */

    mkRealSort() {
        return Z3.Z3_mk_real_sort(this.ctx);
    }

    mkDoubleSort() {
        return Z3.Z3_mk_fpa_sort_64(this.ctx);
    }

    mkAdd(left, right) {
        return this._buildVar(Z3.Z3_mk_add, left, right);
    }

    mkMul(left, right) {
        return this._buildVar(Z3.Z3_mk_mul, left, right);
    }

    mkSub(left, right) {
        return this._buildVar(Z3.Z3_mk_sub, left, right);
    }

    mkUnaryMinus(arg) {
        return this._build(Z3.Z3_mk_unary_minus, arg);
    }

    mkDiv(arg1, arg2) {
        return this._build(Z3.Z3_mk_div, arg1, arg2);
    }

    mkMod(arg1, arg2) {
        return this._build(Z3.Z3_mk_mod, arg1, arg2);
    }

    mkRem(arg1, arg2) {
        return this._build(Z3.Z3_mk_rem, arg1, arg2);
    }

    mkPower(arg1, arg2) {
        return this._build(Z3.Z3_mk_power, arg1, arg2);
    }

    mkLt(left, right) {
        return this._build(Z3.Z3_mk_lt, left, right);
    }

    mkLe(left, right) {
        return this._build(Z3.Z3_mk_le, left, right);
    }

    mkGt(left, right) {
        return this._build(Z3.Z3_mk_gt, left, right);
    }

    mkGe(left, right) {
        return this._build(Z3.Z3_mk_ge, left, right);
    }

    mkInt2Real(arg) {
        return this._build(Z3.Z3_mk_int2real, arg);
    }

    mkReal2Int(arg) {
        return this._build(Z3.Z3_mk_real2int, arg);
    }

    mkIsInt(arg) {
        return this._build(Z3.Z3_mk_is_int, arg);
    }

    /**
     * Numerals
     */

    mkNumeral(numeral, sort) {
        return new Expr(this.ctx, Z3.Z3_mk_numeral(this.ctx, numeral, sort));
    }

    mkReal(num, den) {
        return new Expr(this.ctx, Z3.Z3_mk_real(this.ctx, num, den));
    }

    mkInt(v, sort) {
        return new Expr(this.ctx, Z3.Z3_mk_int(this.ctx, v, sort));
    }

    mkUnsignedInt(v, sort) {
        return new Expr(this.ctx, Z3.Z3_mk_unsigned_int(this.ctx, v, sort));
    }

    mkInt64(v, sort) {
        return new Expr(this.ctx, Z3.Z3_mk_int64(this.ctx, v, sort));
    }

    mkUnsignedInt64(v, sort) {
        return new Expr(this.ctx, Z3.Z3_mk_unsigned_int64(this.ctx, v, sort));
    }

    toString(ast) {
        return Z3.Z3_ast_to_string(this.ctx, this.ast);
    }

    /**
     * Arrays
     */

    mkSelect(array, index) {
        return this._build(Z3.Z3_mk_select, array, index);
    }

    mkStore(array, index, v) {
        return this._build(Z3.Z3_mk_store, array, index, v);
    }

    mkConstArray(sort, v) {
        return new Expr(this.ctx, this.ctx, Z3.Z3_mk_const_array(this.ctx, sort, v.ast));
    }
}

export default Context;