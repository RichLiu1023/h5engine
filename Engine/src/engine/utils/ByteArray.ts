module RM {

	/**
	 * @language zh_CN
	 * Endian 类中包含一些值，它们表示用于表示多字节数字的字节顺序。
	 * 字节顺序为 bigEndian（最高有效字节位于最前）或 littleEndian（最低有效字节位于最前）。
	 * @version Egret 2.4
	 * @platform Web,Native
	 */
	export class Endian {
		/**
		 * @language zh_CN
		 * 表示多字节数字的最低有效字节位于字节序列的最前面。
		 * 十六进制数字 0x12345678 包含 4 个字节（每个字节包含 2 个十六进制数字）。最高有效字节为 0x12。最低有效字节为 0x78。（对于等效的十进制数字 305419896，最高有效数字是 3，最低有效数字是 6）。
		 * @version Egret 2.4
		 * @platform Web,Native
		 */
		public static LITTLE_ENDIAN:string = "littleEndian";

		/**
		 * @language zh_CN
		 * 表示多字节数字的最高有效字节位于字节序列的最前面。
		 * 十六进制数字 0x12345678 包含 4 个字节（每个字节包含 2 个十六进制数字）。最高有效字节为 0x12。最低有效字节为 0x78。（对于等效的十进制数字 305419896，最高有效数字是 3，最低有效数字是 6）。
		 * @version Egret 2.4
		 * @platform Web,Native
		 */
		public static BIG_ENDIAN:string = "bigEndian";

	}

	/**
	 * @language zh_CN
	 * ByteArray 类提供用于优化读取、写入以及处理二进制数据的方法和属性。
	 * 注意：ByteArray 类适用于需要在字节层访问数据的高级开发人员。
	 * @version Egret 2.4
	 * @platform Web,Native
	 * @includeExample egret/utils/ByteArray.ts
	 */
	export class ByteArray {
		private static SIZE_OF_BOOLEAN:number = 1;
		private static SIZE_OF_INT8:number = 1;
		private static SIZE_OF_INT16:number = 2;
		private static SIZE_OF_INT32:number = 4;
		private static SIZE_OF_UINT8:number = 1;
		private static SIZE_OF_UINT16:number = 2;
		private static SIZE_OF_UINT32:number = 4;
		private static SIZE_OF_FLOAT32:number = 4;
		private static SIZE_OF_FLOAT64:number = 8;

		private BUFFER_EXT_SIZE:number = 0;//Buffer expansion size

		private data:DataView;
		private _position:number;
		/**
		 * @private
		 */
		private write_position:number;

		/**
		 * @language zh_CN
		 * 更改或读取数据的字节顺序；egret.Endian.BIG_ENDIAN 或 egret.Endian.LITTLE_ENDIAN。
		 * @default egret.Endian.BIG_ENDIAN
		 * @version Egret 2.4
		 * @platform Web,Native
		 */
		public endian:string;

		constructor( buffer?:ArrayBuffer ) {
			this._setArrayBuffer( buffer || new ArrayBuffer( this.BUFFER_EXT_SIZE ) );
			this.endian = Endian.BIG_ENDIAN;
		}

		private _setArrayBuffer( buffer:ArrayBuffer ):void {
			this.write_position = buffer.byteLength;
			this.data = new DataView( buffer );
			this._position = 0;
		}

		public get buffer():ArrayBuffer {
			return this.data.buffer;
		}

		public set buffer( value:ArrayBuffer ) {
			this.data = new DataView( value );
		}

		public get dataView():DataView {
			return this.data;
		}

		public set dataView( value:DataView ) {
			this.data = value;
			this.write_position = value.byteLength;
		}

		public get bufferOffset():number {
			return this.data.byteOffset;
		}

		/**
		 * @language zh_CN
		 * 将文件指针的当前位置（以字节为单位）移动或返回到 ByteArray 对象中。下一次调用读取方法时将在此位置开始读取，或者下一次调用写入方法时将在此位置开始写入。
		 * @version Egret 2.4
		 * @platform Web,Native
		 */
		public get position():number {
			return this._position;
		}

		public set position( value:number ) {
			this._position = value;
			this.write_position = value > this.write_position ? value : this.write_position;
		}

		/**
		 * @language zh_CN
		 * ByteArray 对象的长度（以字节为单位）。
		 * 如果将长度设置为大于当前长度的值，则用零填充字节数组的右侧。
		 * 如果将长度设置为小于当前长度的值，将会截断该字节数组。
		 * @version Egret 2.4
		 * @platform Web,Native
		 */
		public get length():number {
			return this.write_position;
		}

		public set length( value:number ) {
			this.write_position = value;
			var tmp:Uint8Array = new Uint8Array( new ArrayBuffer( value ) );
			var byteLength:number = this.data.buffer.byteLength;
			if ( byteLength > value ) {
				this._position = value;
			}
			var length:number = Math.min( byteLength, value );
			tmp.set( new Uint8Array( this.data.buffer, 0, length ) );
			this.buffer = tmp.buffer;
		}

		/**
		 * @language zh_CN
		 * 可从字节数组的当前位置到数组末尾读取的数据的字节数。
		 * 每次访问 ByteArray 对象时，将 bytesAvailable 属性与读取方法结合使用，以确保读取有效的数据。
		 * @version Egret 2.4
		 * @platform Web,Native
		 */
		public get bytesAvailable():number {
			return this.data.byteLength - this._position;
		}

		/**
		 * @language zh_CN
		 * 清除字节数组的内容，并将 length 和 position 属性重置为 0。 
		 * @version Egret 2.4
		 * @platform Web,Native
		 */
		public clear():void {
			this._setArrayBuffer( new ArrayBuffer( this.BUFFER_EXT_SIZE ) );
		}

		/**
		 * @language zh_CN
		 * 从字节流中读取布尔值。读取单个字节，如果字节非零，则返回 true，否则返回 false
		 * @return 如果字节不为零，则返回 true，否则返回 false
		 * @version Egret 2.4
		 * @platform Web,Native
		 */
		public readBoolean():boolean {
			if ( !this.validate( ByteArray.SIZE_OF_BOOLEAN ) ) return null;

			return this.data.getUint8( this.position++ ) != 0;
		}

		/**
		 * @language zh_CN
		 * 从字节流中读取带符号的字节
		 * @return 介于 -128 和 127 之间的整数
		 * @version Egret 2.4
		 * @platform Web,Native
		 */
		public readByte():number {
			if ( !this.validate( ByteArray.SIZE_OF_INT8 ) ) return null;

			return this.data.getInt8( this.position++ );
		}

		/**
		 * @language zh_CN
		 * 从字节流中读取 length 参数指定的数据字节数。从 offset 指定的位置开始，将字节读入 bytes 参数指定的 ByteArray 对象中，并将字节写入目标 ByteArray 中
		 * @param bytes 要将数据读入的 ByteArray 对象
		 * @param offset bytes 中的偏移（位置），应从该位置写入读取的数据
		 * @param length 要读取的字节数。默认值 0 导致读取所有可用的数据
		 * @version Egret 2.4
		 * @platform Web,Native
		 */
		public readBytes( bytes:ByteArray, offset:number = 0, length:number = 0 ):void {
			if ( length == 0 ) {
				length = this.bytesAvailable;
			}
			else if ( !this.validate( length ) ) {
				return null;
			}
			if ( bytes ) {
				bytes.validateBuffer( offset + length );
			}
			else {
				bytes = new ByteArray( new ArrayBuffer( offset + length ) );
			}
			for ( var i = 0; i < length; i++ ) {
				bytes.data.setUint8( i + offset, this.data.getUint8( this.position++ ) );
			}
		}

		/**
		 * 从字节流中读取一个 IEEE 754 双精度（64 位）浮点数
		 * @return 双精度（64 位）浮点数
		 */
		public readDouble():number {
			if ( !this.validate( ByteArray.SIZE_OF_FLOAT64 ) ) return null;

			var value:number = this.data.getFloat64( this.position, this.endian == Endian.LITTLE_ENDIAN );
			this.position += ByteArray.SIZE_OF_FLOAT64;
			return value;
		}

		/**
		 * @language zh_CN
		 * 从字节流中读取一个 IEEE 754 单精度（32 位）浮点数
		 * @return 单精度（32 位）浮点数
		 * @version Egret 2.4
		 * @platform Web,Native
		 */
		public readFloat():number {
			if ( !this.validate( ByteArray.SIZE_OF_FLOAT32 ) ) return null;

			var value:number = this.data.getFloat32( this.position, this.endian == Endian.LITTLE_ENDIAN );
			this.position += ByteArray.SIZE_OF_FLOAT32;
			return value;
		}

		/**
		 * @language zh_CN
		 * 从字节流中读取一个带符号的 32 位整数
		 * @return 介于 -2147483648 和 2147483647 之间的 32 位带符号整数
		 * @version Egret 2.4
		 * @platform Web,Native
		 */
		public readInt():number {
			if ( !this.validate( ByteArray.SIZE_OF_INT32 ) ) return null;

			var value = this.data.getInt32( this.position, this.endian == Endian.LITTLE_ENDIAN );
			this.position += ByteArray.SIZE_OF_INT32;
			return value;
		}

		/**
		 * @language zh_CN
		 * 从字节流中读取一个带符号的 16 位整数
		 * @return 介于 -32768 和 32767 之间的 16 位带符号整数
		 * @version Egret 2.4
		 * @platform Web,Native
		 */
		public readShort():number {
			if ( !this.validate( ByteArray.SIZE_OF_INT16 ) ) return null;

			var value = this.data.getInt16( this.position, this.endian == Endian.LITTLE_ENDIAN );
			this.position += ByteArray.SIZE_OF_INT16;
			return value;
		}

		/**
		 * @language zh_CN
		 * 从字节流中读取无符号的字节
		 * @return 介于 0 和 255 之间的 32 位无符号整数
		 * @version Egret 2.4
		 * @platform Web,Native
		 */
		public readUnsignedByte():number {
			if ( !this.validate( ByteArray.SIZE_OF_UINT8 ) ) return null;

			return this.data.getUint8( this.position++ );
		}

		/**
		 * @language zh_CN
		 * 从字节流中读取一个无符号的 32 位整数
		 * @return 介于 0 和 4294967295 之间的 32 位无符号整数
		 * @version Egret 2.4
		 * @platform Web,Native
		 */
		public readUnsignedInt():number {
			if ( !this.validate( ByteArray.SIZE_OF_UINT32 ) ) return null;

			var value = this.data.getUint32( this.position, this.endian == Endian.LITTLE_ENDIAN );
			this.position += ByteArray.SIZE_OF_UINT32;
			return value;
		}

		/**
		 * @language zh_CN
		 * 从字节流中读取一个无符号的 16 位整数
		 * @return 介于 0 和 65535 之间的 16 位无符号整数
		 * @version Egret 2.4
		 * @platform Web,Native
		 */
		public readUnsignedShort():number {
			if ( !this.validate( ByteArray.SIZE_OF_UINT16 ) ) return null;

			var value = this.data.getUint16( this.position, this.endian == Endian.LITTLE_ENDIAN );
			this.position += ByteArray.SIZE_OF_UINT16;
			return value;
		}

		/**
		 * @language zh_CN
		 * 从字节流中读取一个 UTF-8 字符串。假定字符串的前缀是无符号的短整型（以字节表示长度）
		 * @return UTF-8 编码的字符串
		 * @version Egret 2.4
		 * @platform Web,Native
		 */
		public readUTF():string {
			if ( !this.validate( ByteArray.SIZE_OF_UINT16 ) ) return null;

			var length:number = this.data.getUint16( this.position, this.endian == Endian.LITTLE_ENDIAN );
			this.position += ByteArray.SIZE_OF_UINT16;

			if ( length > 0 ) {
				return this.readUTFBytes( length );
			} else {
				return "";
			}
		}

		/**
		 * @language zh_CN
		 * 从字节流中读取一个由 length 参数指定的 UTF-8 字节序列，并返回一个字符串
		 * @param length 指明 UTF-8 字节长度的无符号短整型数
		 * @return 由指定长度的 UTF-8 字节组成的字符串
		 * @version Egret 2.4
		 * @platform Web,Native
		 */
		public readUTFBytes( length:number ):string {
			if ( !this.validate( length ) ) return null;

			var bytes:Uint8Array = new Uint8Array( this.buffer, this.bufferOffset + this.position, length );
			this.position += length;
			return this.decodeUTF8( bytes );
		}

		/**
		 * @language zh_CN
		 * 写入布尔值。根据 value 参数写入单个字节。如果为 true，则写入 1，如果为 false，则写入 0
		 * @param value 确定写入哪个字节的布尔值。如果该参数为 true，则该方法写入 1；如果该参数为 false，则该方法写入 0
		 * @version Egret 2.4
		 * @platform Web,Native
		 */
		public writeBoolean( value:boolean ):void {
			this.validateBuffer( ByteArray.SIZE_OF_BOOLEAN );

			this.data.setUint8( this.position++, value ? 1 : 0 );
		}

		/**
		 * @language zh_CN
		 * 在字节流中写入一个字节
		 * 使用参数的低 8 位。忽略高 24 位
		 * @param value 一个 32 位整数。低 8 位将被写入字节流
		 * @version Egret 2.4
		 * @platform Web,Native
		 */
		public writeByte( value:number ):void {
			this.validateBuffer( ByteArray.SIZE_OF_INT8 );

			this.data.setInt8( this.position++, value );
		}

		/**
		 * @language zh_CN
		 * 将指定字节数组 bytes（起始偏移量为 offset，从零开始的索引）中包含 length 个字节的字节序列写入字节流
		 * 如果省略 length 参数，则使用默认长度 0；该方法将从 offset 开始写入整个缓冲区。如果还省略了 offset 参数，则写入整个缓冲区
		 * 如果 offset 或 length 超出范围，它们将被锁定到 bytes 数组的开头和结尾
		 * @param bytes ByteArray 对象
		 * @param offset 从 0 开始的索引，表示在数组中开始写入的位置
		 * @param length 一个无符号整数，表示在缓冲区中的写入范围
		 * @version Egret 2.4
		 * @platform Web,Native
		 */
		public writeBytes( bytes:ByteArray, offset:number = 0, length:number = 0 ):void {
			var writeLength:number;
			if ( offset < 0 ) {
				return;
			}
			if ( length < 0 ) {
				return;
			}
			else if ( length == 0 ) {
				writeLength = bytes.length - offset;
			}
			else {
				writeLength = Math.min( bytes.length - offset, length );
			}
			if ( writeLength > 0 ) {
				this.validateBuffer( writeLength );

				var tmp_data = new DataView( bytes.buffer );
				for ( var i = offset; i < writeLength + offset; i++ ) {
					this.data.setUint8( this.position++, tmp_data.getUint8( i ) );
				}
			}
		}

		/**
		 * @language zh_CN
		 * 在字节流中写入一个 IEEE 754 双精度（64 位）浮点数
		 * @param value 双精度（64 位）浮点数
		 * @version Egret 2.4
		 * @platform Web,Native
		 */
		public writeDouble( value:number ):void {
			this.validateBuffer( ByteArray.SIZE_OF_FLOAT64 );

			this.data.setFloat64( this.position, value, this.endian == Endian.LITTLE_ENDIAN );
			this.position += ByteArray.SIZE_OF_FLOAT64;
		}

		/**
		 * @language zh_CN
		 * 在字节流中写入一个 IEEE 754 单精度（32 位）浮点数
		 * @param value 单精度（32 位）浮点数
		 * @version Egret 2.4
		 * @platform Web,Native
		 */
		public writeFloat( value:number ):void {
			this.validateBuffer( ByteArray.SIZE_OF_FLOAT32 );

			this.data.setFloat32( this.position, value, this.endian == Endian.LITTLE_ENDIAN );
			this.position += ByteArray.SIZE_OF_FLOAT32;
		}

		/**
		 * @language zh_CN
		 * 在字节流中写入一个带符号的 32 位整数
		 * @param value 要写入字节流的整数
		 * @version Egret 2.4
		 * @platform Web,Native
		 */
		public writeInt( value:number ):void {
			this.validateBuffer( ByteArray.SIZE_OF_INT32 );

			this.data.setInt32( this.position, value, this.endian == Endian.LITTLE_ENDIAN );
			this.position += ByteArray.SIZE_OF_INT32;
		}

		/**
		 * @language zh_CN
		 * 在字节流中写入一个 16 位整数。使用参数的低 16 位。忽略高 16 位
		 * @param value 32 位整数，该整数的低 16 位将被写入字节流
		 * @version Egret 2.4
		 * @platform Web,Native
		 */
		public writeShort( value:number ):void {
			this.validateBuffer( ByteArray.SIZE_OF_INT16 );

			this.data.setInt16( this.position, value, this.endian == Endian.LITTLE_ENDIAN );
			this.position += ByteArray.SIZE_OF_INT16;
		}

		/**
		 * @language zh_CN
		 * 在字节流中写入一个无符号的 32 位整数
		 * @param value 要写入字节流的无符号整数
		 * @version Egret 2.4
		 * @platform Web,Native
		 */
		public writeUnsignedInt( value:number ):void {
			this.validateBuffer( ByteArray.SIZE_OF_UINT32 );

			this.data.setUint32( this.position, value, this.endian == Endian.LITTLE_ENDIAN );
			this.position += ByteArray.SIZE_OF_UINT32;
		}

		/**
		 * @language zh_CN
		 * 在字节流中写入一个无符号的 16 位整数
		 * @param value 要写入字节流的无符号整数
		 * @version Egret 2.5
		 * @platform Web,Native
		 */
		public writeUnsignedShort( value:number ):void {
			this.validateBuffer( ByteArray.SIZE_OF_UINT16 );

			this.data.setUint16( this.position, value, this.endian == Endian.LITTLE_ENDIAN );
			this.position += ByteArray.SIZE_OF_UINT16;
		}

		/**
		 * @language zh_CN
		 * 将 UTF-8 字符串写入字节流。先写入以字节表示的 UTF-8 字符串长度（作为 16 位整数），然后写入表示字符串字符的字节
		 * @param value 要写入的字符串值
		 * @version Egret 2.4
		 * @platform Web,Native
		 */
		public writeUTF( value:string ):void {
			var utf8bytes:Uint8Array = this.encodeUTF8( value );
			var length:number = utf8bytes.length;

			this.validateBuffer( ByteArray.SIZE_OF_UINT16 + length );

			this.data.setUint16( this.position, length, this.endian == Endian.LITTLE_ENDIAN );
			this.position += ByteArray.SIZE_OF_UINT16;
			this._writeUint8Array( utf8bytes, false );
		}

		/**
		 * @language zh_CN
		 * 将 UTF-8 字符串写入字节流。类似于 writeUTF() 方法，但 writeUTFBytes() 不使用 16 位长度的词为字符串添加前缀
		 * @param value 要写入的字符串值
		 * @version Egret 2.4
		 * @platform Web,Native
		 */
		public writeUTFBytes( value:string ):void {
			this._writeUint8Array( this.encodeUTF8( value ) );
		}

		public toString():string {
			return "[ByteArray] length:" + this.length + ", bytesAvailable:" + this.bytesAvailable;
		}

		/**
		 * @private
		 * 将 Uint8Array 写入字节流
		 * @param bytes 要写入的Uint8Array
		 * @param validateBuffer
		 */
		public _writeUint8Array( bytes:Uint8Array, validateBuffer:boolean = true ):void {
			if ( validateBuffer ) {
				this.validateBuffer( this.position + bytes.length );
			}

			for ( var i = 0; i < bytes.length; i++ ) {
				this.data.setUint8( this.position++, bytes[ i ] );
			}
		}

		/**
		 * @param len
		 * @returns
		 * @version Egret 2.4
		 * @platform Web,Native
		 * @private
		 */
		public validate( len:number ):boolean {
			if ( this.data.byteLength > 0 && this._position + len <= this.data.byteLength ) {
				return true;
			} else {
				console.warn( "ByteArray validate Error!" );
				return false;
			}
		}

		/**********************/
		/*  PRIVATE METHODS   */
		/**********************/
		/**
		 * @private
		 * @param len
		 * @param needReplace
		 */
		private validateBuffer( len:number, needReplace:boolean = false ):void {
			this.write_position = len > this.write_position ? len : this.write_position;
			len += this._position;
			if ( this.data.byteLength < len || needReplace ) {
				var tmp:Uint8Array = new Uint8Array( new ArrayBuffer( len + this.BUFFER_EXT_SIZE ) );
				var length = Math.min( this.data.buffer.byteLength, len + this.BUFFER_EXT_SIZE );
				tmp.set( new Uint8Array( this.data.buffer, 0, length ) );
				this.buffer = tmp.buffer;
			}
		}

		/**
		 * @private
		 * UTF-8 Encoding/Decoding
		 */
		private encodeUTF8( str:string ):Uint8Array {
			var pos:number = 0;
			var codePoints = this.stringToCodePoints( str );
			var outputBytes = [];

			while ( codePoints.length > pos ) {
				var code_point:number = codePoints[ pos++ ];

				if ( this.inRange( code_point, 0xD800, 0xDFFF ) ) {
					this.encoderError( code_point );
				}
				else if ( this.inRange( code_point, 0x0000, 0x007f ) ) {
					outputBytes.push( code_point );
				} else {
					var count, offset;
					if ( this.inRange( code_point, 0x0080, 0x07FF ) ) {
						count = 1;
						offset = 0xC0;
					} else if ( this.inRange( code_point, 0x0800, 0xFFFF ) ) {
						count = 2;
						offset = 0xE0;
					} else if ( this.inRange( code_point, 0x10000, 0x10FFFF ) ) {
						count = 3;
						offset = 0xF0;
					}

					outputBytes.push( this.div( code_point, Math.pow( 64, count ) ) + offset );

					while ( count > 0 ) {
						var temp = this.div( code_point, Math.pow( 64, count - 1 ) );
						outputBytes.push( 0x80 + (temp % 64) );
						count -= 1;
					}
				}
			}
			return new Uint8Array( outputBytes );
		}

		/**
		 * @private
		 *
		 * @param data
		 * @returns
		 */
		private decodeUTF8( data:Uint8Array ):string {
			var fatal:boolean = false;
			var pos:number = 0;
			var result:string = "";
			var code_point:number;
			var utf8_code_point = 0;
			var utf8_bytes_needed = 0;
			var utf8_bytes_seen = 0;
			var utf8_lower_boundary = 0;

			while ( data.length > pos ) {

				var _byte = data[ pos++ ];

				if ( _byte == this.EOF_byte ) {
					if ( utf8_bytes_needed != 0 ) {
						code_point = this.decoderError( fatal );
					} else {
						code_point = this.EOF_code_point;
					}
				} else {

					if ( utf8_bytes_needed == 0 ) {
						if ( this.inRange( _byte, 0x00, 0x7F ) ) {
							code_point = _byte;
						} else {
							if ( this.inRange( _byte, 0xC2, 0xDF ) ) {
								utf8_bytes_needed = 1;
								utf8_lower_boundary = 0x80;
								utf8_code_point = _byte - 0xC0;
							} else if ( this.inRange( _byte, 0xE0, 0xEF ) ) {
								utf8_bytes_needed = 2;
								utf8_lower_boundary = 0x800;
								utf8_code_point = _byte - 0xE0;
							} else if ( this.inRange( _byte, 0xF0, 0xF4 ) ) {
								utf8_bytes_needed = 3;
								utf8_lower_boundary = 0x10000;
								utf8_code_point = _byte - 0xF0;
							} else {
								this.decoderError( fatal );
							}
							utf8_code_point = utf8_code_point * Math.pow( 64, utf8_bytes_needed );
							code_point = null;
						}
					} else if ( !this.inRange( _byte, 0x80, 0xBF ) ) {
						utf8_code_point = 0;
						utf8_bytes_needed = 0;
						utf8_bytes_seen = 0;
						utf8_lower_boundary = 0;
						pos--;
						code_point = this.decoderError( fatal, _byte );
					} else {

						utf8_bytes_seen += 1;
						utf8_code_point = utf8_code_point + (_byte - 0x80) * Math.pow( 64, utf8_bytes_needed - utf8_bytes_seen );

						if ( utf8_bytes_seen !== utf8_bytes_needed ) {
							code_point = null;
						} else {

							var cp = utf8_code_point;
							var lower_boundary = utf8_lower_boundary;
							utf8_code_point = 0;
							utf8_bytes_needed = 0;
							utf8_bytes_seen = 0;
							utf8_lower_boundary = 0;
							if ( this.inRange( cp, lower_boundary, 0x10FFFF ) && !this.inRange( cp, 0xD800, 0xDFFF ) ) {
								code_point = cp;
							} else {
								code_point = this.decoderError( fatal, _byte );
							}
						}

					}
				}
				//Decode string
				if ( code_point !== null && code_point !== this.EOF_code_point ) {
					if ( code_point <= 0xFFFF ) {
						if ( code_point > 0 )result += String.fromCharCode( code_point );
					} else {
						code_point -= 0x10000;
						result += String.fromCharCode( 0xD800 + ((code_point >> 10) & 0x3ff) );
						result += String.fromCharCode( 0xDC00 + (code_point & 0x3ff) );
					}
				}
			}
			return result;
		}

		/**
		 * @private
		 *
		 * @param code_point
		 */
		private encoderError( code_point ) {
			console.warn( "ByteArray encoderError Error!" );
		}

		/**
		 * @private
		 *
		 * @param fatal
		 * @param opt_code_point
		 * @returns
		 */
		private decoderError( fatal, opt_code_point? ):number {
			if ( fatal ) {
				console.warn( "ByteArray decoderError Error!" );
			}
			return opt_code_point || 0xFFFD;
		}

		/**
		 * @private
		 */
		private EOF_byte:number = -1;
		/**
		 * @private
		 */
		private EOF_code_point:number = -1;

		/**
		 * @private
		 *
		 * @param a
		 * @param min
		 * @param max
		 */
		private inRange( a, min, max ) {
			return min <= a && a <= max;
		}

		/**
		 * @private
		 *
		 * @param n
		 * @param d
		 */
		private div( n, d ) {
			return Math.floor( n / d );
		}

		/**
		 * @private
		 *
		 * @param string
		 */
		private stringToCodePoints( string ) {
			/** @type {Array.<number>} */
			var cps = [];
			// Based on http://www.w3.org/TR/WebIDL/#idl-DOMString
			var i = 0, n = string.length;
			while ( i < string.length ) {
				var c = string.charCodeAt( i );
				if ( !this.inRange( c, 0xD800, 0xDFFF ) ) {
					cps.push( c );
				} else if ( this.inRange( c, 0xDC00, 0xDFFF ) ) {
					cps.push( 0xFFFD );
				} else { // (inRange(c, 0xD800, 0xDBFF))
					if ( i == n - 1 ) {
						cps.push( 0xFFFD );
					} else {
						var d = string.charCodeAt( i + 1 );
						if ( this.inRange( d, 0xDC00, 0xDFFF ) ) {
							var a = c & 0x3FF;
							var b = d & 0x3FF;
							i += 1;
							cps.push( 0x10000 + (a << 10) + b );
						} else {
							cps.push( 0xFFFD );
						}
					}
				}
				i += 1;
			}
			return cps;
		}
	}
}