import _throttle from 'lodash/throttle'

interface ThrottleOptions
{
	leading?: boolean
	trailing?: boolean
}

function throttle(wait: number = 100, options: ThrottleOptions | undefined = undefined)
{
	return function (target: any, propertyKey: string, descriptor: PropertyDescriptor)
	{
		const originalFunc = descriptor.value
		delete descriptor.value
		delete descriptor.writable

		const throttledFunc = _throttle(originalFunc, wait, options)
		descriptor.get = function () {
			return throttledFunc.bind(this)
		}
    }
}

export default throttle
