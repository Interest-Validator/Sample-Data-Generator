# Sample-Data-Generator

Generates realistic sample loans datasets. Used for testing.

## Purpose

The goals of this generator are:

- Provide realistic test files for:
  - Manual testing
  - Integration Tests
  - Benchmarks
- Provide these test files at any scale
- Provide these test files in formats:
  - Excel
  - CSV
  - Access
  - JSON
- Provide test files with multiple invalid, warning and error datasets
- Provide these tests with an REST API and as Downloads

The goal of this generator is NOT to generate every single possible combination of the different parameters, e.g. different datatypes of inputs. These tests should run in Unit tests.

To do this the generator should create files in a 'samples' folder and handle incoming requests with an express server.

## Generate Files

Each 'File-Set' has three components: 'File-Settings', 'Current-Loans' and 'Previous-Loans'. They get generated into seperate folders in `./samples`, named after the samples specifications.

### Sample Files

Each Run of the generator generates following files:

- All components of the File-Set combined in one JSON
- Current-Loans CSV
- Previous-Loans CSV
- File-Settings JSON
- TODO: Excel & Access

### Sample Specifications

The Sample can be specified in following ways:

- Sample Type (`sample`): `minimal`, `full` or `possibilities`
- Number of Loans* (`n`): `Integer`
- Realistic Loans* (`realistic`): `true`, or `false`

*Only if Sample Type is not `possibilities`

The files can be generated with a REST HTTP GET request which has the syntax: `http://localhost:3301/samples?QUERY`. The Query defines the specifications:

``` bash

$ curl http://localhost:3301/samples?sample=minimal&realistic=true&n=100
Generates 100 minimal and realistic samples

$ curl http://localhost:3301/samples?sample=possibilities
Generates all (most) possibile combinations

```
