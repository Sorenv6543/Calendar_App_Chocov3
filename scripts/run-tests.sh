#!/bin/bash

# Function to print usage
function print_usage {
  echo "Run Vitest tests for the Calendar app"
  echo ""
  echo "Usage: ./run-tests.sh [OPTIONS]"
  echo ""
  echo "Options:"
  echo "  -w, --watch       Run tests in watch mode"
  echo "  -c, --coverage    Run tests with coverage"
  echo "  -u, --update      Update snapshots"
  echo "  -f, --filter      Filter tests by name (e.g. FullCalendar)"
  echo "  -h, --help        Show this help message"
  echo ""
  echo "Examples:"
  echo "  ./run-tests.sh                  # Run all tests once"
  echo "  ./run-tests.sh -w               # Run tests in watch mode"
  echo "  ./run-tests.sh -c               # Run tests with coverage"
  echo "  ./run-tests.sh -f FullCalendar  # Run only FullCalendar tests"
}

# Default options
WATCH=true
COVERAGE=true
UPDATE=true
FILTER=""

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    -w|--watch)
      WATCH=true
      shift
      ;;
    -c|--coverage)
      COVERAGE=true
      shift
      ;;
    -u|--update)
      UPDATE=true
      shift
      ;;
    -f|--filter)
      FILTER="$2"
      shift
      shift
      ;;
    -h|--help)
      print_usage
      exit 0
      ;;
    *)
      echo "Unknown option: $1"
      print_usage
      exit 1
      ;;
  esac
done

# Build the command
CMD="npx vitest"

if [ "$WATCH" = true ]; then
  CMD="$CMD"
else
  CMD="$CMD run"
fi

if [ "$COVERAGE" = true ]; then
  CMD="$CMD --coverage"
fi

if [ "$UPDATE" = true ]; then
  CMD="$CMD -u"
fi

if [ ! -z "$FILTER" ]; then
  CMD="$CMD $FILTER"
fi

# Run the command
echo "Running: $CMD"
eval $CMD 