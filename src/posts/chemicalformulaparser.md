---
title: "Creating a Chemical Formula Parser using Rust"
subtitle: "chemical-formula-rs"
date: "2024-2-24"
eyecatch: "/images/eyecatch/chemical-formula.png"
tags:
  - Chemistry
  - Parser
  - Rust
  - pest
  - Library
---

# Creating a Chemical Formula Parser using Rust

## TL;DR

In this article we will discuss about creating a parser for chemical formula using Rust. We will use the `pest` library to create the parser.

The final code is in the [GitHub repository](https://github.com/Ameyanagi/chemical-formula-rs)
and the crate is published in the crates.io as [`chemical_formula`](https://crates.io/crates/chemical-formula)  
The complete documentation and the references are available in the [doc.rs](https://docs.rs/chemical-formula/latest/chemical_formula/)

## Background

I am an experimental and analytical chemist working on the field of X-ray absorption spectroscopy. I also work on on the development of the software tools that helps on the analysis of the experimental data.

During my work, I have to deal with the chemical composition of the compounds that I am working with. The chemical composition is usually represented as a chemical formula in the field of homogeneous systems, but typically mix representation in the field of heterogeneous systems (including catalyst, polymers, and industrial chemistry).

## Objective

The objective of this work is to create a parser for the chemical formula that can handle the mix representation of stoichiometry and wt%, along with nested parenthesis. The parser should also provide a simple api to convert the parsed data to a standard chemical formula representation or a weight percentage representation.

The chemical formula parsers are commonly used in many languages and if we focus on Rust, following crates are available:

**Comparison between chemical formula parsers**

| Crate                                                                     | Can parse nested paranthesis | Can parse weight percentage |
| ------------------------------------------------------------------------- | ---------------------------- | --------------------------- |
| [chemical_formula](https://crates.io/crates/chemical_formula) (this work) | Yes                          | Yes                         |
| [ATOMIO](https://crates.io/crates/atomio)                                 | Yes                          | No                          |
| [acetylene_parser](https://crates.io/crates/acetylene_parser)             | Yes                          | No                          |
| [chemical_elements](https://crates.io/crates/chemical_elements)           | Yes                          | No                          |
| [chem-parse](https://crates.io/crates/chem-parse)                         | ? I couldn't run the code    | No                          |

There is no crate available that can parse the weight percentage along with the nested parenthesis. The `chemical_formula` crate is the only crate that can parse both of them.

## Example formula to be parsed

- `H2O`: Very simple formula.
- 'Fe2(SO4)3': A formula including parenthesis.
- '[Cu(H2O)6]Cl2': A formula including nested parenthesis and square brackets.
- 'Fe2{SO4}3': Curly braces instead of parenthesis.
- `5wt%Pt/SiO2`: A formula including weight percentage and a slash.
- `(5wt%Pt/SiO2)50wt%(CeO2)50wt%` : A formula of a mixture including weight percentage.

# Pest parser

When it comes to parsing complex string inputs in Rust, the `pest` library stands out as a powerful, yet user-friendly tool. Utilizing Parsing Expression Grammar (PEG), `pest` enables developers to define clear and concise grammars for a wide range of languages. This article delves into using `pest` to parse chemical formulas, showcasing its simplicity and flexibility.

## What is PEG?

Parsing Expression Grammar (PEG) is a method for describing a formal grammar for a language. Unlike traditional context-free grammars, PEGs are deterministic, making them particularly suitable for parsing tasks where predictability and efficiency are key. In PEG, the choice operator ensures that the first matching rule is selected, eliminating ambiguity in grammar interpretation.

## Why Pest?

[Pest](https://pest.rs/) is a parser generator for Rust that leverages the power of PEG. Its main advantages include:

- **Ease of Use:** Pest offers a straightforward syntax for defining grammars.
- **Performance:** It compiles grammar rules into Rust code, ensuring fast parsing.
- **Documentation:** Comprehensive documentation makes it accessible for both beginners and experienced users.
- **Flexibility:** Pest can parse anything from simple configurations to complex languages.

## Defining Grammar for Chemical Formulas

Chemical formulas present a unique challenge due to their concise notation and the need for precise interpretation. The grammar for parsing chemical formulas with `pest` is defined in a `.pest` file, where each rule represents a part of the formula's structure. Let's break down the provided grammar:

```pest
formula = { SOI ~ expr* ~ EOI }
```

- **formula**: The root rule that matches from the Start Of Input (SOI) to the End Of Input (EOI), containing zero or more expressions.

```pest
element = { element_symbol ~ stoichiometry }
```

- **element**: Combines an element symbol with its stoichiometry, indicating the element's quantity or weight percentage.

```pest
group = {
    (("(" ~ (expr)+ ~ ")") | ("[" ~ (expr)+ ~ "]") | ("{" ~ (expr)+ ~ "}")) ~ stoichiometry
}
```

- **group**: Defines a group of expressions enclosed in parentheses, brackets, or braces, optionally followed by stoichiometry.

```pest
expr = _{
    element
  | group
  | separator
}
```

- **expr**: Represents an expression, which can be an element, a group, or a separator. It's the core rule that recursively defines the structure of the formula.

```pest
element_symbol = {
    "He" | "Li" | "Be" | ... | "Ts" | "Og"
}
```

- **element_symbol**: Lists all valid chemical element symbols, ensuring that only recognized elements are parsed.

The grammar also includes rules for **number**, **weight_percent**, **stoichiometry**, and **separator**, which handle numerical values, weight percentages, and various separators (spaces, tabs, dots, etc.) within the formula.

## Combined pest file

```pest
formula = { SOI ~ expr* ~ EOI }
element = { element_symbol ~ stoichiometry }
number         = { ("+" | "-")* ~ ASCII_DIGIT* ~ ("." ~ ASCII_DIGIT+)? }
weight_percent = { number ~ "wt%" }
stoichiometry  = { weight_percent | number }
group          = {
    (("(" ~ (expr)+ ~ ")") | ("[" ~ (expr)+ ~ "]") | ("{" ~ (expr)+ ~ "}")) ~ stoichiometry
}
separator = _{ " " | "\t" | "." | "@" | "/" | NEWLINE }
expr      = _{
    element
  | group
  | separator
}
element_symbol = {
    "He"
  | "Li"
  | "Be"
  | "Ne"
  | "Na"
  | "Mg"
  | "Al"
  | "Si"
  | "Cl"
  | "Ar"
  | "Ca"
  | "Sc"
  | "Ti"
  | "Cr"
  | "Mn"
  | "Fe"
  | "Ni"
  | "Co"
  | "Cu"
  | "Zn"
  | "Ga"
  | "Ge"
  | "As"
  | "Se"
  | "Br"
  | "Kr"
  | "Rb"
  | "Sr"
  | "Zr"
  | "Nb"
  | "Mo"
  | "Tc"
  | "Ru"
  | "Rh"
  | "Pd"
  | "Ag"
  | "Cd"
  | "In"
  | "Sn"
  | "Sb"
  | "Te"
  | "Xe"
  | "Cs"
  | "Ba"
  | "La"
  | "Ce"
  | "Pr"
  | "Nd"
  | "Pm"
  | "Sm"
  | "Eu"
  | "Gd"
  | "Tb"
  | "Dy"
  | "Ho"
  | "Er"
  | "Tm"
  | "Yb"
  | "Lu"
  | "Hf"
  | "Ta"
  | "Re"
  | "Os"
  | "Ir"
  | "Pt"
  | "Au"
  | "Hg"
  | "Tl"
  | "Pb"
  | "Bi"
  | "Th"
  | "Pa"
  | "Np"
  | "Pu"
  | "Am"
  | "Cm"
  | "Bk"
  | "Cf"
  | "Es"
  | "Fm"
  | "Md"
  | "No"
  | "Lr"
  | "Rf"
  | "Db"
  | "Sg"
  | "Bh"
  | "Hs"
  | "Mt"
  | "Ds"
  | "Rg"
  | "Cn"
  | "Nh"
  | "Fl"
  | "Mc"
  | "Lv"
  | "Ts"
  | "Og"
  | "H"
  | "B"
  | "C"
  | "N"
  | "O"
  | "F"
  | "P"
  | "S"
  | "K"
  | "V"
  | "Y"
  | "I"
  | "W"
  | "U"
}
```

## Advantages of Using Pest for Chemical Formulas

Using `pest` for parsing chemical formulas offers several benefits:

- **Accuracy:** The deterministic nature of PEG ensures precise parsing of formulas.
- **Readability:** The grammar is easy to read and understand, facilitating maintenance and updates.
- **Efficiency:** Pest compiles grammar into optimized Rust code, offering excellent performance.

In conclusion, `pest` provides a robust framework for parsing chemical formulas in Rust. By leveraging PEG grammar, developers can define flexible and efficient parsers that handle the intricacies of chemical notation with ease. Whether you're building a scientific application, a data analysis tool, or simply exploring the possibilities of Rust, `pest` offers the capabilities to meet your parsing needs.

# ChemicalFormula Struct

The chemical formula will be stored in a struct called `ChemicalFormula`. The struct will have three fields:`element`, `stoichiometry` and `wt_percent`.
The `element` field will be a `HashSet` of `ElementSymbol` enum. The `stoichiometry` and `wt_percent` will be a `HashMap` of `ElementSymbol` and `f64`. The `ElementSymbol` is an enum that contains all the elements in the periodic table.

```rust
#[derive(Debug, Clone, Default)]
pub struct ChemicalFormula {
    pub element: HashSet<ElementSymbol>,
    pub stoichiometry: HashMap<ElementSymbol, f64>,
    pub wt_percent: HashMap<ElementSymbol, f64>,
}
```

## Methods of ChemicalFormula

The `ChemicalFormula` struct will have the following methods:

The `ChemicalFormula` struct has the following methods:

- `add_element` - Add an element to the formula.
- `add_wt_percent` - Add an element to the formula by wt%.
- `multiply` - Multiply the stoichiometry and wt% by a multiplier.
- `to_molecular_formula` - Convert the formula to molecular formula.
- `to_mol_percent` - Convert the formula to mol%.
- `molecular_weight` - Calculate the molecular weight of the formula.
- `to_wt` - Calculate the molecular weight representation of the formula.
- `to_wt_percent` - Convert the formula to wt%.
- `multiply_wt_percent` - Multiply the wt% by a multiplier.
- `add_formula` - Add another formula to the formula.

Example usage of the `ChemicalFormula` struct:

```rust
use chemical_formula::prelude::*;
use approx::assert_abs_diff_eq;

let mut formula = ChemicalFormula::new();
let mut formula2 = ChemicalFormula::new();

formula.add_element(ElementSymbol::O, 1.0);
formula.add_wt_percent(ElementSymbol::H, 10.0);
formula.add_wt_percent(ElementSymbol::N, 20.0);
formula2.add_element(ElementSymbol::O, 1.0);
formula2.add_wt_percent(ElementSymbol::H, 10.0);
formula2.add_wt_percent(ElementSymbol::N, 20.0);
formula.add_formula(&formula2);

assert_abs_diff_eq!(formula.stoichiometry[&ElementSymbol::O], 2.0, epsilon = 1e-6);
assert_abs_diff_eq!(formula.wt_percent[&ElementSymbol::H], 20.0, epsilon = 1e-6);
assert_abs_diff_eq!(formula.wt_percent[&ElementSymbol::N], 40.0, epsilon = 1e-6);
```

# Parsing of the Chemical Formula

Once the grammar and the final structure is defined, the next step is to parse the chemical formula using the `pest` library to the tree. This can be done by using the `pest` library to parse the input string using the defined grammar.

```rust
use pest::Parser;
use pest_derive::Parser;
use pest::iterators::Pair;

#[derive(Parser)]
#[grammar = "formula.pest"]
pub struct ChemicalFormulaParser {}
```

## Recursive Parsing

The Abstract Syntax Tree is parsed recursively by the recursive function call and the `match` statement. The `match` statement is used to match the different rules defined in the grammar.

```rust
fn parse_formula_pairs(pair: Pair<Rule>) -> ChemicalFormula {
    match pair.as_rule() {
        Rule::formula => pair
            .into_inner()
            .map(|x| parse_formula_pairs(x))
            .fold(&mut ChemicalFormula::new(), |acc, x| acc.add_formula(&x))
            .to_owned(),
        Rule::group => {
            let mut formula = ChemicalFormula::new();
            for p in pair.into_inner() {
                match p.as_rule() {
                    Rule::element => {
                        formula.add_formula(&parse_formula_pairs(p));
                    }
                    Rule::stoichiometry => {
                        let stoichiometry = p.into_inner().next();

                        if stoichiometry.is_none() {
                            return formula.to_owned();
                        }

                        let stoichiometry = stoichiometry.unwrap();

                        match stoichiometry.as_rule() {
                            Rule::number => {
                                formula.multiply(stoichiometry.as_str().parse().unwrap());
                            }
                            Rule::weight_percent => {
                                formula
                                    .multiply_wt_percent(
                                        stoichiometry
                                            .into_inner()
                                            .next()
                                            .unwrap()
                                            .as_str()
                                            .parse()
                                            .unwrap(),
                                    )
                                    .unwrap();
                            }
                            _ => unreachable!(),
                        }
                    }
                    _ => unreachable!(),
                }
            }

            formula.to_owned()
        }
        Rule::element => {
            let mut rule = pair.into_inner();
            let element = rule.next().unwrap();
            let stoichiometry = rule.next().unwrap().into_inner().next();

            if stoichiometry.is_none() {
                return ChemicalFormula::new()
                    .add_element(ElementSymbol::from_str(element.as_str()), 1.)
                    .to_owned();
            }

            let stoichiometry = stoichiometry.unwrap();

            match stoichiometry.as_rule() {
                Rule::number => ChemicalFormula::new()
                    .add_element(
                        ElementSymbol::from_str(element.as_str()),
                        stoichiometry.as_str().parse().unwrap_or(1.0),
                    )
                    .to_owned(),
                Rule::weight_percent => ChemicalFormula::new()
                    .add_wt_percent(
                        ElementSymbol::from_str(element.as_str()),
                        stoichiometry
                            .into_inner()
                            .next()
                            .unwrap()
                            .as_str()
                            .parse()
                            .unwrap(),
                    )
                    .to_owned(),
                _ => {
                    unreachable!()
                }
            }
        }
        Rule::EOI => ChemicalFormula::new(),
        Rule::number
        | Rule::separator
        | Rule::expr
        | Rule::weight_percent
        | Rule::stoichiometry
        | Rule::element_symbol => {
            unreachable!();
        }
    }
}
```

Here, the name of the `Rule` is the same as the name of the rule defined in the grammar. The `match` statement is used to match the different rules and the `pair.into_inner()` is used to get the inner pairs of the current pair.

The `match` statement analyzes the `Rule` of the current pair, so that we don't miss any of the rules defined in the grammar. Then the appropriate method of the `ChemicalFormula` struct is called based on the `Rule` of the current pair.

# Publishing the crate

This was the first crate that I have published to the crates.io. The process of publishing the crate was very simple. The steps to publish the crate are as follows:

- Login to the crates.io using the github account, then obtain the API token.
- `cargo login` to login to the crates.io.
- Create a `Cargo.toml` file with the required fields.
- Run `cargo publish --dry-run` to check for any errors.
- Run `cargo publish` to publish the crate.

I wish if it was this simple to publish the software in other languages as well. Very satisfying and easy process, that I would like to appriciate the Rust community for making it so simple.

# Conclusion

We discussed about the chemical formula parser that can parse the chemical formula including the nested parenthesis and the wt%. We also discussed about the `pest` library and the `ChemicalFormula` struct that is used to store the parsed data. The crate is published in the crates.io as [`chemical_formula`](https://crates.io/crates/chemical-formula) and the complete documentation and the references are available in the [doc.rs](https://docs.rs/chemical-formula/latest/chemical_formula/).

The developer experience were super good compared to the other languages that I have worked with. It was so smooth that, this crate was created in 2 days for the initial version.
