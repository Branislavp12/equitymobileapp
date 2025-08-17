import { describe, it, expect, beforeAll, jest } from "@jest/globals";
import React from "react";
import renderer, { act } from "react-test-renderer";
import { Text, TouchableOpacity } from "react-native";

import CalendarGrid, { getMonthGrid } from "./CalendarGrid";

beforeAll(() => {
  // Disable development logs during tests
  // @ts-ignore
  global.__DEV__ = false;
});

describe("getMonthGrid", () => {
  it("returns correct day count and sequential weeks", () => {
    const grid = getMonthGrid(2024, 1); // February 2024 (leap year)
    // grid should have 6 weeks, each with 7 days
    expect(grid).toHaveLength(6);
    expect(grid.every(week => week.length === 7)).toBe(true);

    const days = grid
      .flat()
      .map(cell => cell.day)
      .filter((d): d is number => d !== null);

    // 29 days in February 2024
    expect(days).toHaveLength(29);
    // Days should be ordered sequentially
    expect(days).toEqual(Array.from({ length: 29 }, (_, i) => i + 1));
  });
});

describe("CalendarGrid navigation and day press", () => {
  it("navigates months and triggers onDayPress only for valid dates", () => {
    const onDayPress = jest.fn();
    let component: renderer.ReactTestRenderer;

    act(() => {
      component = renderer.create(
        <CalendarGrid initialYear={2023} initialMonth={0} onDayPress={onDayPress} />
      );
    });

    const months = [
      "Január",
      "Február",
      "Marec",
      "Apríl",
      "Máj",
      "Jún",
      "Júl",
      "August",
      "September",
      "Október",
      "November",
      "December",
    ];

    const getHeader = () => {
      const node = component.root.findAllByType(Text).find(n => {
        const text = Array.isArray(n.props.children)
          ? n.props.children.join("")
          : n.props.children;
        return typeof text === "string" && months.some(m => text.startsWith(m));
      });
      return Array.isArray(node!.props.children)
        ? node!.props.children.join("")
        : node!.props.children;
    };

    expect(getHeader()).toBe("Január 2023");

    const findArrow = (symbol: string) =>
      component.root.findAllByType(TouchableOpacity).find(btn => {
        try {
          const textNode = btn.findByType(Text);
          const content = Array.isArray(textNode.props.children)
            ? textNode.props.children.join("")
            : textNode.props.children;
          return content === symbol;
        } catch {
          return false;
        }
      })!;

    act(() => {
      findArrow("›").props.onPress();
    });
    expect(getHeader()).toBe("Február 2023");

    act(() => {
      findArrow("‹").props.onPress();
    });
    expect(getHeader()).toBe("Január 2023");

    const dayCells = component.root.findAll(
      node =>
        node.type === TouchableOpacity &&
        Object.prototype.hasOwnProperty.call(node.props, "disabled")
    );

    const validCell = dayCells.find(cell => !cell.props.disabled)!;
    const emptyCell = dayCells.find(cell => cell.props.disabled)!;

    act(() => {
      validCell.props.onPress();
    });
    expect(onDayPress).toHaveBeenCalledTimes(1);

    act(() => {
      emptyCell.props.onPress();
    });
    expect(onDayPress).toHaveBeenCalledTimes(1);
  });
});

