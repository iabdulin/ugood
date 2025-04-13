export function ErrorMessage({ errorKey, message }: { errorKey: string, message: string }) {
  return message ? <div className="text-red-400 mt-2" data-testid={`error-${errorKey}`}>{message}</div> : null
}
