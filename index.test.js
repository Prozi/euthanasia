const euthanasia = require('.');

jest.useFakeTimers();

describe('euthanasia', () => {
  let exitSpy;

  beforeEach(() => {
    exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllTimers();
    exitSpy.mockRestore();
  });

  it('should not exit if usage is below limits', async () => {
    euthanasia({
      memory: 10_000, // big limit
      cpu: 100,       // big limit
      interval: 1000,
      ready: async () => {
        throw new Error('Should not be called');
      },
    });

    jest.advanceTimersByTime(3000);
    expect(exitSpy).not.toHaveBeenCalled();
  });

  it('should exit when memory exceeds limit', async () => {
    const result = new Promise((resolve) => {
      euthanasia({
        memory: 1, // low limit
        interval: 10,
        ready: async ({ memory }) => {
          expect(typeof memory).toBe('number');
          return true;
        },
      });
      setTimeout(resolve, 100);
    });

    jest.advanceTimersByTime(100);
    await result;

    expect(exitSpy).toHaveBeenCalledWith(0);
  });

  it('should exit when CPU exceeds limit', async () => {
    let first = true;
    const result = new Promise((resolve) => {
      euthanasia({
        cpu: 0.001, // force trigger
        interval: 10,
        ready: async ({ cpu }) => {
          // skip the first call, CPU difference will be zero
          if (first) {
            first = false;
            return false;
          }

          expect(typeof cpu).toBe('number');
          return true;
        },
      });
      setTimeout(resolve, 100);
    });

    jest.advanceTimersByTime(100);
    await result;

    expect(exitSpy).toHaveBeenCalledWith(0);
  });

  it('should not exit if ready returns false', async () => {
    euthanasia({
      memory: 1,
      cpu: 0.001,
      interval: 10,
      ready: async () => false,
    });

    jest.advanceTimersByTime(100);
    expect(exitSpy).not.toHaveBeenCalled();
  });
});
