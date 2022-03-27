import CircularBuffer, {
  BufferFullError,
  BufferEmptyError,
} from './circular-buffer';

describe('CircularBuffer', () => {
  test('should construct buffer',()=>{
    expect(()=>new CircularBuffer(2)).not.toThrow(Error);
  })
  test('should be able to clear correctly',()=>{
    const buffer = new CircularBuffer(3);

    buffer.write(1);
    buffer.write(2);
    buffer.write(3);

    buffer.clear();

    expect(buffer.getSize()).toBe(0);
  })

  test("should be able to read correctly",()=>{
    const buffer = new CircularBuffer(3);

    buffer.write(1);
    buffer.write(2);
    buffer.write(3);

    expect(buffer.read()).toBe(1);
    expect(buffer.read()).toBe(2);
    expect(buffer.read()).toBe(3);
  });

  test("should be able to force write when it's full",()=>{
    const buffer = new CircularBuffer(3);

    buffer.write(1);
    buffer.write(2);
    buffer.write(3);
  
    expect(()=> buffer.forceWrite(4)).not.toThrow(BufferFullError);
  });

  test("should read correct value when it's force written",()=>{
    const buffer = new CircularBuffer(3);

    buffer.write(1);
    buffer.write(2);
    buffer.write(3);
    buffer.forceWrite(4);
    expect(buffer.read()).toBe(2);

    buffer.forceWrite(5);
    expect(buffer.read()).toBe(4);
  });

  test("should not be able to write when it's full",()=>{
    const buffer = new CircularBuffer(3);

    buffer.write(1);
    buffer.write(2);
    buffer.write(3);
    expect(()=> buffer.write(4)).toThrow(BufferFullError);
  });

  test('should not be able to read empty buffer', () => {
    const buffer = new CircularBuffer(2);
    expect(() => buffer.read()).toThrow(BufferEmptyError);
  });

  test('can read an item just written', () => {
    const buffer = new CircularBuffer(2);
    buffer.write('1');
    expect(buffer.read()).toBe('1');
  });

  describe('passed initial values', () => { 
      test('should set correctly', () => { 
        const buffer = new CircularBuffer(3,[1,2,3]);
        expect(buffer.getListAsArray()).toEqual([1,2,3]);
      })
  
      test('should not throw error if no value passed', () => { 
        expect(()=>new CircularBuffer(3)).not.toThrow(Error);
      })
  
      test('should throw error if passed value is not an array', () => { 
        expect(()=>new CircularBuffer(3,{})).toThrow(Error);
      })

      test('should throw error if passed value size is more than capacity', () => { 
        expect(()=>new CircularBuffer(3,[1,2,3,4])).toThrow(Error);
      })
   })

  describe("throw an error when capacity value is",()=>{
    test('character',() => {
      const character = 'TEST';
      expect(() => new CircularBuffer(character)).toThrow(Error);
    });
    test('number less than 2',() => {
      expect(() => new CircularBuffer(1)).toThrow(Error);
      expect(() => new CircularBuffer(0)).toThrow(Error);
    })
    test('empty',() => {
      expect(() => new CircularBuffer()).toThrow(Error);
    })
    test('object',() => {
      expect(() => new CircularBuffer({})).toThrow(Error);
    })
    test('NaN',() => {
      expect(() => new CircularBuffer('12as')).toThrow(Error);
    })
  })

  describe('should have correct size',()=>{
    const capacity = 4;
    test('when no value written',()=>{
      const buffer = new CircularBuffer(capacity);

      expect(buffer.getSize()).toBe(0);
    })

    test('when 1 value written',()=>{
      const buffer = new CircularBuffer(capacity);

      buffer.write(1);

      expect(buffer.getSize()).toBe(1);
    })

    test('when 1 value written, 1 value read',()=>{
      const buffer = new CircularBuffer(capacity);

      buffer.write(1);
      buffer.read();

      expect(buffer.getSize()).toBe(0);
    })

    test('when 3 values written, 1 item read',()=>{
      const buffer = new CircularBuffer(capacity);

      buffer.write(1);
      buffer.write(2);
      buffer.write(3);
      buffer.read();

      expect(buffer.getSize()).toBe(2);
    })

    test(`when 4 values written, 1 item read with the capacity of ${capacity}`,()=>{
      const buffer = new CircularBuffer(capacity);

      buffer.write(1);
      buffer.write(2);
      buffer.write(3);
      buffer.write(4);
      buffer.read();

      expect(buffer.getSize()).toBe(3);
    })

    test(`when 4 values written, 1 item force written with the capacity of ${capacity}`,()=>{
      const buffer = new CircularBuffer(capacity);

      buffer.write(1);
      buffer.write(2);
      buffer.write(3);
      buffer.write(4);
      buffer.forceWrite(5);

      expect(buffer.getSize()).toBe(4);
    })
  });

  describe('data', () => {
    test("should have correct values (write operation only)", () => { 
      const buffer = new CircularBuffer(3);
      
      buffer.write(1);
      buffer.write(2);
      buffer.write(3);

      expect(buffer.getListAsArray()).toEqual([1,2,3]);
     })

     test("should have correct values (write and read operations)", () => { 
      const buffer = new CircularBuffer(3);
      
      buffer.write(1);
      buffer.write(2);
      buffer.write(3);
      buffer.read();

      expect(buffer.getListAsArray()).toEqual([undefined,2,3]);
      buffer.write(4);
      expect(buffer.getListAsArray()).toEqual([4,2,3]);
      buffer.read();
      expect(buffer.getListAsArray()).toEqual([4,undefined,3]);
      buffer.read();
      buffer.read();
      expect(buffer.getListAsArray()).toEqual([undefined,undefined,undefined]);
     })

     test("should have correct values (write,force write and read operations)", () => { 
      const buffer = new CircularBuffer(3);
      
      buffer.write(1);
      buffer.write(2);
      buffer.write(3);
      buffer.forceWrite(4);

      expect(buffer.getListAsArray()).toEqual([4,2,3]);
      buffer.read();
      expect(buffer.getListAsArray()).toEqual([4,undefined,3]);
      buffer.write(5);
      expect(buffer.getListAsArray()).toEqual([4,5,3]);
     })
  })
});
