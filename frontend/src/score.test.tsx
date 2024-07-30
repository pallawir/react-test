import React from 'react';
import { render,screen, fireEvent,waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Questionnaire from '../src/score';
jest.mock('./questions', () => ({
  QUESTIONS: {
    '1': 'Question 1',
    '2': 'Question 2',
    '3': 'Question 3',
  },
}));

describe('Questionnaire', () => {
    beforeEach(() => {
      localStorage.clear();
    });
    test('load initial state from localStorage', () => {
      localStorage.setItem('totalScore', '100');
      localStorage.setItem('totalRuns', '2');
      render(<Questionnaire />);
      expect(screen.getByText('Total runs: 2')).toBeInTheDocument();
      expect(screen.getByText('Average Rating: 50.00%')).toBeInTheDocument();
    });
    test('calculate score and update state', async () => {
      render(<Questionnaire />);
      fireEvent.click(screen.getAllByText('Yes')[0]);
      fireEvent.click(screen.getAllByText('Yes')[1]);
      fireEvent.click(screen.getAllByText('No')[2]);
      fireEvent.click(screen.getByText('Calculate Score'));
      await waitFor(() => {
        expect(screen.getByText('Score: 66.67%')).toBeInTheDocument();
      });
    });
    test('update local storage on score calculation', async () => {
      render(<Questionnaire />);
      fireEvent.click(screen.getAllByText('Yes')[0]);
      fireEvent.click(screen.getAllByText('Yes')[1]);
      fireEvent.click(screen.getAllByText('No')[2]);
      fireEvent.click(screen.getByText('Calculate Score'));
      await waitFor(() => {
        
        expect(localStorage.getItem('totalScore')).toBe('66.66666666666666');
        expect(localStorage.getItem('totalRuns')).toBe('1');
      })
    });
    test('reset questions', async () => {
      render(<Questionnaire />);
      fireEvent.click(screen.getAllByText('Yes')[0]);
      fireEvent.click(screen.getAllByText('Yes')[1]);
      fireEvent.click(screen.getAllByText('No')[2]);
      fireEvent.click(screen.getByText('Calculate Score'));
      await waitFor(() => {
        expect(screen.getByText('Score: 66.67%')).toBeInTheDocument();
      });
      fireEvent.click(screen.getByText('Reset'));
      expect(screen.getByText('Score: 0.00%')).toBeInTheDocument();
    });
    test('handle answer change correctly', () => {
      render(<Questionnaire />);
      fireEvent.click(screen.getAllByText('Yes')[0]);
      expect(screen.getAllByText('Yes')[0]).toHaveClass('selected');
      fireEvent.click(screen.getAllByText('No')[0]);
      expect(screen.getAllByText('No')[0]).toHaveClass('selected');
    });
});
