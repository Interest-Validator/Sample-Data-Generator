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
